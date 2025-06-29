const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    pool
} = require('../../../config/postgresql');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');

router.post('/moderator/course/create', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const name = req.body.name;
        const descriptions = req.body.descriptions;
        const seen = req.body.private === 'on';
        const approved = req.body.approved === 'on';

        const name_check = await pool.query("SELECT * FROM course_list WHERE name = $1", [name]);

        if (name_check.rows.length > 0) {
            req.session.error = "A course with this name already exists.";
            req.session.save();
            res.redirect('/moderator/dashboard');
        } else {
            const results = await pool.query("INSERT INTO course_list (name, descriptions, seen, approved) VALUES ($1, $2, $3, $4) RETURNING id", [name, descriptions, seen, approved])
            await pool.query("INSERT INTO courses (course_id, user_id, type) VALUES ($1, $2, $3)", [results.rows[0].id, decoded.id, 2]);

            req.session.success = "The course has been successfully created.";
            req.session.save();
            res.redirect('/moderator/dashboard');
        }

    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

router.get('/moderator/course/create', (req, res) => {
    res.redirect('/moderator/dashboard');
});

module.exports = router;