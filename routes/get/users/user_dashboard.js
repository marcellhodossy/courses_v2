const express = require("express");
const router = express.Router();
const {
    pool
} = require("../../../config/postgresql.js");
const pg = require("pg");
const {
    verifyJWT
} = require("../../../config/jsonwebtoken.js");

router.get("/users/dashboard", async (req, res) => {

    const type = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === "true" && type.id > 0) {

        const course_results = await pool.query("SELECT c.id, c.course_id, cl.name, cl.descriptions FROM courses c JOIN course_list cl ON cl.id = c.course_id WHERE c.user_id = $1", [type.id]);
        const available_results = await pool.query("SELECT cl.* FROM course_list cl LEFT JOIN courses c ON cl.id = c.course_id AND c.user_id = $1 WHERE c.id IS NULL AND cl.seen = true", [type.id]);

        var course = [];

        for (let i = 0; i < course_results.rows.length; i++) {
            course[i] = {
                id: course_results.rows[i].course_id,
                name: course_results.rows[i].name,
                description: course_results.rows[i].descriptions
            };
        }

        var course_available = [];

        for (let i = 0; i < available_results.rows.length; i++) {
            course_available[i] = {
                id: available_results.rows[i].id,
                name: available_results.rows[i].name,
                description: available_results.rows[i].descriptions
            };
        }

        res.render('users/user_dashboard.ejs', {
            username: req.cookies.username,
            course: course,
            course_available: course_available,
            error: req.session.error,
            success: req.session.success
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