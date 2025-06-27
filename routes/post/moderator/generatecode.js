const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../nodejs/config/jsonwebtoken');
const {
    pool
} = require('../../../nodejs/config/postgresql');

function generateCode(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

router.post('/moderator/course/:id/generate_code', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;
    const lifetime = req.body.lifetime === 'on';

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);

        if (check.rows.length > 0) {

            await pool.query('INSERT INTO course_codes (course_id, code, lifetime) VALUES ($1,$2,$3)', [id, generateCode(10), lifetime]);

            req.session.success = "Access code successfully created.";
            req.session.save();
            res.redirect(`/moderator/course/${id}/edit`)


        } else {
            req.session.error = "You do not have moderator rights for this course.";
            req.session.save();
            res.redirect('/moderator/dashboard');
        }

    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

module.exports = router;