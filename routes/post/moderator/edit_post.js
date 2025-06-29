const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const {
    pool
} = require('../../../config/postgresql');

router.post('/moderator/course/:id/posts/edit', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);
        
        if (check.rows.length > 0) {

            await pool.query('UPDATE posts SET title = $1, text = $2 WHERE id = $3 AND course_id = $4', [req.body.title, req.body.text, req.body.id, id])

        } else {
            req.session.error = "You do not have moderator rights for this course.";
        }

    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

module.exports = router;