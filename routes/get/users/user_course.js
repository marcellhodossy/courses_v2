const express = require('express');
const {
    pool
} = require('../../../config/postgresql');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const pg = require('pg');
const router = express.Router();

router.get('/users/course/:id/', async (req, res) => {

    const id = req.params.id;
    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === "true" && decoded.id > 0) {

        const check = await pool.query("SELECT * FROM courses WHERE course_id = $1 AND user_id = $2", [id, decoded.id]);
        const posts = await pool.query(` SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id WHERE posts.course_id = $1 `, [id]);
        const course = await pool.query("SELECT * FROM course_list WHERE id = $1", [id]);

        if (check.rows.length > 0) {
            var posts_list = [];

            for (let i = 0; i < posts.rows.length; i++) {
                posts_list[i] = {
                    title: posts.rows[i].title,
                    text: posts.rows[i].text,
                    author: posts.rows[i].username,
                    date: posts.rows[i].date
                };
            }

            res.render('users/user_course.ejs', {
                course_name: course.rows[0].name,
                course_id: id,
                posts: posts_list,
            });

        } else {
            req.session.error = "You do not have access to this course.";
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