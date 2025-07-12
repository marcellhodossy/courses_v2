const express = require('express');
const router = express.Router();
const {
    pool
} = require('../../../config/postgresql.js');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken.js');

router.post('/users/join/courses', async (req, res) => {
    try {
        const decoded = await verifyJWT(req.cookies.token);

        if (req.cookies.isAuth === "true" && decoded.id > 0) {
            if (req.body.invite_code) {
                const code_data = await pool.query(
                    "SELECT * FROM course_codes WHERE code = $1 AND active = true",
                    [req.body.invite_code]
                );

                if (code_data.rows.length === 0) {
                    req.session.error = "Invalid or expired invite code.";
                    req.session.save();
                    return res.redirect('/users/dashboard');
                }

                const course_id = code_data.rows[0].course_id;

                const course_data = await pool.query(
                    "SELECT * FROM course_list WHERE id = $1",
                    [course_id]
                );

                if (course_data.rows.length === 0 || course_data.rows[0].approved !== true) {
                    req.session.error = "This course is not approved.";
                    req.session.save();
                    return res.redirect('/users/dashboard');
                }

                const check_review = await pool.query(
                    "SELECT * FROM reviews WHERE course_id = $1 AND user_id = $2",
                    [course_id, decoded.id]
                );

                if (check_review.rows.length > 0) {
                    req.session.error = "You have already submitted your application.";
                    req.session.save();
                    return res.redirect('/users/dashboard');
                }

                const check_course = await pool.query(
                    "SELECT * FROM courses WHERE course_id = $1 AND user_id = $2",
                    [course_id, decoded.id]
                );

                if (check_course.rows.length > 0) {
                    req.session.error = "You are already part of this course.";
                    req.session.save();
                    return res.redirect('/users/dashboard');
                }

                await pool.query(
                    "INSERT INTO reviews (course_id, user_id) VALUES ($1, $2)",
                    [course_id, decoded.id]
                );

                req.session.success = "You have been placed on a waiting list. If approved, you will be notified.";
                req.session.save();

                if (!code_data.rows[0].lifetime) {
                    await pool.query(
                        "UPDATE course_codes SET active = false WHERE id = $1",
                        [code_data.rows[0].id]
                    );
                }

                return res.redirect('/users/dashboard');

            } else {
                req.session.error = "Missing invite code.";
                req.session.save();
                return res.redirect('/users/dashboard');
            }

        } else {
            res.clearCookie("isAuth");
            res.clearCookie("token");
            return res.redirect("/login");
        }
    } catch (err) {
        console.error(err);
        req.session.error = "Something went wrong. Please try again later.";
        req.session.save();
        return res.redirect('/users/dashboard');
    }
});


module.exports = router;