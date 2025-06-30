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

function verifyMail(content) {
    const emailRegex = /^[a-zA-Z0-9._%\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(content);
}

router.post('/settings/email_change', async (req, res) => {
    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {
        const {
            new_mail,
            passwd
        } = req.body;

        const check_passwd = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

        if (await verifyPassword(check_passwd.rows[0].password, passwd) === true) {
            if (verifyMail(new_mail) === false) {
                req.session.error = "The password is not correct."
                req.session.save();
                res.redirect('/settings');
            } else if (new_mail > 100) {
                req.session.error = "The email maximal is 100 characters."
                req.session.save();
                res.redirect('/settings');
            } else {
                await pool.query("UPDATE users SET username = $1 WHERE id = $2", [new_mail, decoded.id]);
                req.session.success = "Your email has been successfully changed.";
                req.session.save();
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