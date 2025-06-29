const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken.js');
const {
    pool
} = require('../../../config/postgresql.js');

router.get('/moderator/course/:id/edit', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;
    const start_page = req.query.start || "codes";

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND course_id = $2 AND type = 2', [decoded.id, id]);

        if (check.rows.length > 0) {

            const data = await pool.query('SELECT * FROM course_list WHERE id = $1', [id]);
            const codes = await pool.query('SELECT * FROM course_codes WHERE course_id = $1 AND active = true', [data.rows[0].id]);
            const reviews = await pool.query('SELECT r.*, u.username FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.course_id = $1', [data.rows[0].id]);
            const members = await pool.query('SELECT c.id AS member_id, c.*, u.username AS username FROM courses c JOIN users u ON c.user_id = u.id WHERE c.course_id = $1', [data.rows[0].id]);
const posts = await pool.query('SELECT posts.*, users.username FROM posts JOIN users ON users.id = posts.user_id WHERE posts.course_id = $1', [id]);            
            var code = [];

            for (let i = 0; i < codes.rows.length; i++) {

                let type_v;

                if (codes.rows[i].lifetime === true) {
                    type_v = "LifeTime";
                } else {
                    type_v = "One Time Code"
                }
                code[i] = {
                    code: codes.rows[i].code,
                    type: type_v,
                    id: codes.rows[i].id
                }
            }

            var reviews_list = [];

            for (let i = 0; i < reviews.rows.length; i++) {

                reviews_list[i] = {
                    name: reviews.rows[i].username,
                    date: reviews.rows[i].date,
                    id: reviews.rows[i].id,
                };

            }

            var members_list = [];

            for (let i = 0; i < members.rows.length; i++) {

                members_list[i] = {
                    name: members.rows[i].username,
                    join_date: members.rows[i].logged,
                    id: members.rows[i].id
                };

            }

            var posts_list = [];

            for(let i = 0; i < posts.rows.length; i++) {
                posts_list[i] = {
                    title: posts.rows[i].title,
                    text: posts.rows[i].text,
                    id: posts.rows[i].id,
                    date: posts.rows[i].date,
                    author: posts.rows[i].username
              }
            }

            res.render('moderator/moderator_edit.ejs', {
                course_name: data.rows[0].name,
                course_id: data.rows[0].id,
                descriptions: data.rows[0].descriptions,
                codes: code,
                reviews: reviews_list,
                members: members_list,
                posts: posts_list,
                start_page: start_page,
                error: req.session.error,
                success: req.session.success
            });

            req.session.error = null;
            req.session.success = null;

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