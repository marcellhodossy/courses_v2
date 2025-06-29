const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    pool
} = require('../../../config/postgresql.js');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken.js');

router.post('/users/join/courses', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === "true" && decoded.id > 0) {

        if (req.body.invite_code) {


            const code_data = await pool.query("SELECT * FROM course_codes WHERE code = $1 AND active = true", [req.body.invite_code]);
            const course_data = await pool.query("SELECT * FROM course_list WHERE id = $1", [code_data.rows[0].course_id]);

            if (course_data.rows[0].approved === true) {
                const check_2 = await pool.query("SELECT * FROM reviews WHERE course_id = $1 AND user_id = $2", [code_data.rows[0].course_id, decoded.id]);

                if (check_2.rows.length > 0) {

                    req.session.error = "You have already submitted your application. If your application is accepted by the moderators, you will be notified.";
                    req.session.save();
                    res.redirect('/users/dashboard');

                } else {

                    const insert = await pool.query("INSERT INTO reviews (course_id, user_id) VALUES ($1, $2)", [code_data.rows[0].course_id, decoded.id]);
                    req.session.success = "You have been placed on a waiting list, if the course moderators accept your application you will be notified.";
                    req.session.save();

                    if (code_data.rows[0].lifetime === false) {
                        await pool.query("UPDATE course_codes SET active = false WHERE id = $1", [code_data.rows[0].id]);
                    }

                    res.redirect('/users/dashboard');
                }
            } else {
                const insert = await pool.query("INSERT INTO courses (course_id, user_id) VALUES ($1,$2)", [code_data.rows[0].course_id, decoded.id]);
                req.session.success = "You have successfully entered the course.";
                req.session.save();
                res.redirect('/users/dashboard');

                if (code_data.rows[0].lifetime === false) {
                    const update = await pool.query("UPDATE FROM codes course_codes SET active = false WHERE id = $1", [code_data.rows[0].id]);
                }
            }



        } else {
            res.redirect('/users/dashboard')
        }





    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

router.get('/users/join/courses', (req, res) => {

    res.redirect('/users/dashboard');

});

module.exports = router;