const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    pool
} = require('../../../nodejs/config/postgresql.js');
const {
    verifyJWT
} = require('../../../nodejs/config/jsonwebtoken.js');

router.get('/moderator/dashboard', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const course_results = await pool.query(`SELECT c.id, c.course_id, cl.name, cl.descriptions FROM courses c JOIN course_list cl ON cl.id = c.course_id WHERE c.type = 2 AND c.user_id = $1`, [decoded.id]);

        var courses = [];

        for (let i = 0; i < course_results.rows.length; i++) {
            courses[i] = {
                id: course_results.rows[i].course_id,
                name: course_results.rows[i].name,
                descriptions: course_results.rows[i].descriptions,
            };
        }

        res.render('moderator/moderator_dashboard.ejs', {
            course: courses,
            error: req.session.error,
            success: req.session.success,
        });

        req.session.error = null;
        req.session.success = null;
        req.session.save();

    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }


});

module.exports = router;