const express = require('express');
const {
    pool
} = require('../../../config/postgresql');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken');
const router = express.Router();
const {
    hashPassword,
    verifyPassword
} = require('../../../config/argon2');
const pg = require('pg');

router.post('/settings/username_change', async (req, res) => {
    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {
        const {
            new_username,
            passwd
        } = req.body;

        const check_passwd = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

        if (await verifyPassword(check_passwd.rows[0].password, passwd) === true) {
            if (new_username < 8) {
                req.session.error = "The username minimal length is 8 characters."
                req.session.save();
                res.redirect('/settings');
            } else if (new_username > 100) {
                req.session.error = "The username maximal length is 100 characters."
                req.session.save();
                res.redirect('/settings');
            } else {
                await pool.query("UPDATE users SET username = $1 WHERE id = $2", [new_username, decoded.id]);
                req.session.success = "Your username has been successfully changed.";
                req.session.save();
                res.cookie("username", new_username);
                res.redirect('/settings');
            }
        } else {
            req.session.error = "The password is not correct."
            req.session.save();
            res.redirect('/settings');
        }
    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

module.exports = router;