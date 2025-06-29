const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const {
    pool
} = require('../../../config/postgresql');

router.get('/moderator/course/:id/posts/delete', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;
    const posts_id = req.query.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);
        const check2 = await pool.query("SELECT * FROM posts WHERE id = $1 AND course_id = $2", [posts_id, id]);

        if (check.rows.length > 0) {

            await pool.query("DELETE FROM posts WHERE id = $1 AND course_id = $2 ", [posts_id, id]);
            req.session.success = "The post has been deleted.";
            req.session.save();
            res.redirect(`/moderator/course/${id}/edit?start=manage_post`);

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