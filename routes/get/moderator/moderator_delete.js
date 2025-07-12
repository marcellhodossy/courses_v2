const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    pool
} = require('../../../config/postgresql.js');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken.js');

router.get('/moderator/course/:id/delete', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);
    const course_id = req.params.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query("SELECT * FROM courses WHERE user_id = $1 AND course_id = $2 AND type = $3", [decoded.id, course_id, 2]);

        if (check.rows.length > 0) {

            await pool.query("DELETE FROM courses WHERE course_id = $1", [course_id]);
            await pool.query("DELETE FROM course_list WHERE id = $1 WHERE type = 1", [course_id]);
            await pool.query("DELETE FROM course_codes WHERE course_id = $1", [course_id]);
            await pool.query("DELETE FROM reviews WHERE course_id = $1", [course_id]);

            req.session.success = "The course has been deleted.";
            req.session.save();
            res.redirect('/moderator/dashboard');

        } else {
            req.session.error = "You are not authorised to perform this operation.";
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