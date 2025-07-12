const express = require("express");
const router = express.Router();
const pg = require("pg");
const {
    pool
} = require('../../../config/postgresql');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');

router.get('/users/join/:id', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === "true" && decoded.id > 0) {

        const id = req.params.id;

        const results = await pool.query("SELECT * FROM course_list WHERE id = $1", [id]);

        if (results.rows[0].seen === true) {

            if (results.rows[0].approved === false) {

                const check = await pool.query("SELECT * FROM courses WHERE course_id = $1 AND user_id = $2", [id, decoded.id]);

                if (check.rows.length > 0) {
                    req.session.error = "You have already joined this course.";
                    req.session.save();
                    res.redirect('/users/dashboard');
                } else {
                    const insert = await pool.query("INSERT INTO courses (course_id, user_id) VALUES ($1,$2)", [id, decoded.id]);
                    req.session.success = "You have successfully joined the course.";
                    req.session.save();
                    res.redirect("/users/dashboard");
                }
            } else {
                const check_2 = await pool.query("SELECT * FROM reviews WHERE course_id = $1 AND user_id = $2", [id, decoded.id]);

                if (check_2.rows.length > 0) {

                    req.session.error = "You have already submitted your application. If your application is accepted by the moderators, you will be notified.";
                    req.session.save();
                    res.redirect('/users/dashboard');

                } else {

                    const insert = await pool.query("INSERT INTO reviews (course_id, user_id) VALUES ($1, $2)", [id, decoded.id]);
                    req.session.success = "You have been placed on a waiting list, if the course moderators accept your application you will be notified.";
                    req.session.save();
                    res.redirect('/users/dashboard');
                }
            }


        } else {
            req.session.error = "This is a private course. You can only enter with a code.";
            req.session.save();
            res.redirect('/users/dashboard');
        }

    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

module.exports = router;