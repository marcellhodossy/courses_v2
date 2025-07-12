const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken.js');
const {
    pool
} = require('../../../config/postgresql.js');
const {
    transporter
} = require('../../../config/email.js');

router.get('/moderator/course/:id/managment', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;
    const reviews_id = Number(req.query.reviews_id);
    const choice = req.query.choice;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query("SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3", [decoded.id, Number(2), id]);

        if (check.rows.length > 0) {

            const review_data = await pool.query("SELECT * FROM reviews WHERE id = $1", [reviews_id]);
            console.log(review_data);
            const user_data = await pool.query("SELECT * FROM users WHERE id = $1", [review_data.rows[0].user_id]);

            if (choice === "deny") {
                const mailOptions = {
                    from: process.env.SMTP_USERNAME,
                    to: user_data.rows[0].email,
                    subject: 'Review Status',
                    html: "<h1>Review Status</h1><h3>Your reviews is declined.</h3>"
                };

                await pool.query("DELETE FROM reviews WHERE id = $1", [reviews_id]);
                await transporter.sendMail(mailOptions);

                req.session.success = "The review has been successfully declined.";
                req.session.save();
                res.redirect(`/moderator/course/${id}/edit?start=reviews`);

            } else {
                const mailOptions = {
                    from: process.env.SMTP_USERNAME,
                    to: user_data.rows[0].email,
                    subject: 'Review Status',
                    html: "<h1>Review Status</h1></br><h3>Your review is accepted.</h3>"
                };

                const check_3 = await pool.query("SELECT * FROM courses WHERE course_id = $1 AND user_id = $2", [id, user_data.rows[0].id]);

                if (check_3.rows.length > 0) {
                    res.redirect(`/moderator/course/${id}/edit?start=reviews`);
                } else {

                    await pool.query("DELETE FROM reviews WHERE id = $1", [reviews_id]);
                    await pool.query("INSERT INTO courses (course_id, user_id, type) VALUES ($1,$2,$3)", [id, user_data.rows[0].id, 1]);
                    await transporter.sendMail(mailOptions);
                }

                req.session.success = "The review has been successfully accepted.";
                req.session.save();
                res.redirect(`/moderator/course/${id}/edit?start=reviews`);
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