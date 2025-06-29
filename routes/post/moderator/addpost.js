const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const {
    pool
} = require('../../../config/postgresql');

router.post('/moderator/course/:id/addpost', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);

        if (check.rows.length > 0) {

            const {
                title,
                text
            } = req.body;

            if (!title) {
                req.session.error = "The title field is empty."
                req.session.save();
                res.redirect(`/moderator/course/${id}/edit?start=post`)
            }

            if (!text) {
                req.session.error = "The text field is empty."
                req.session.save();
                res.redirect(`/moderator/course/${id}/edit?start=post`)
            }

            if (title && text) {
                await pool.query("INSERT INTO posts (course_id, user_id, title, text) VALUES ($1, $2, $3, $4)", [id, decoded.id, title, text]);
                req.session.success = "The post was successfully completed.";
                req.session.save();
                res.redirect(`/moderator/course/${id}/edit?start=post`)
            }

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