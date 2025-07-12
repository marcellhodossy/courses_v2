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


router.post('/settings/password_change', async (req, res) => {
    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {
        const {
            old_passwd,
            new_passwd
        } = req.body;

        const check_passwd = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

        if (await verifyPassword(check_passwd.rows[0].password, old_passwd) === true) {
            if (new_passwd < 8) {
                req.session.error = "The password minimal length is 8 characters."
                req.session.save();
                res.redirect('/settings');
            } else if (new_passwd > 32) {
                req.session.error = "The password maximal length is 32 characters."
                req.session.save();
                res.redirect('/settings');
            } else {
                const passwd = await hashPassword(new_passwd);
                await pool.query("UPDATE users SET password = $1 WHERE id = $2", [passwd, decoded.id]);
                req.session.success = "Your password has been successfully changed.";
                req.session.save();
                res.redirect('/settings');
            }
        } else {
            req.session.error = "The old password is not correct."
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