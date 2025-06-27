const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../nodejs/config/jsonwebtoken');
const {
    pool
} = require('../../../nodejs/config/postgresql');

router.get('/moderator/course/:id/unactive', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;
    const code_id = req.query.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);

        if (check.rows.length > 0) {

            await pool.query("UPDATE course_codes SET active = false WHERE id = $1", [code_id]);
            req.session.success = "The code has been successfully suspended.";
            req.session.save();
            res.redirect(`/moderator/course/${id}/edit`);

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