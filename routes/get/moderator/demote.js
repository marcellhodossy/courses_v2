const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const {
    pool
} = require('../../../config/postgresql');

router.get('/moderator/course/:id/demote', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;
    const user_id = req.query.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);

        if (check.rows.length > 0) {

            await pool.query("UPDATE courses SET type = 1 WHERE user_id = $1 AND course_id = $2", [user_id, id]);
            req.session.success = "The user has been successfully demoted.";
            req.session.save();
            res.redirect(`/moderator/course/${id}/edit?start=members`);

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