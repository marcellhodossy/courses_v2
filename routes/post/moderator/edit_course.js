const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const {
    pool
} = require('../../../config/postgresql');

router.post('/moderator/course/:id/edit_course', async (req, res) => {


    const decoded = await verifyJWT(req.cookies.token);
    const id = req.params.id;

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {

        const check = await pool.query('SELECT * FROM courses WHERE user_id = $1 AND type = $2 AND course_id = $3', [decoded.id, 2, id]);

        if (check.rows.length > 0) {

            const name = req.body.name;
            const description = req.body.desc;
            const seen = req.body.private === 'on';
            const approved = req.body.approved === 'on';

            if (name && description) {

                await pool.query("UPDATE course_list SET name = $1, descriptions = $2, seen = $3, approved = $4 WHERE id = $5", [name, description, seen, approved, id]);

                res.redirect(`/moderator/course/${id}/edit?start=manage_course`)


            } else {
                req.session.error = "The course needs a name and a description.";
                req.session.save();
                res.redirect(`/moderator/course/${id}/edit`);
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