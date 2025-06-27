const express = require('express');
const router = express.Router();
const {
    pool
} = require('../../../nodejs/config/postgresql.js');
const pg = require('pg');
const {
    verifyPassword,
    hashPassword
} = require('../../../nodejs/config/argon2.js');
const {
    createJWT
} = require('../../../nodejs/config/jsonwebtoken.js');

function verifyMail(content) {
    const emailRegex = /^[a-zA-Z0-9._%\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(content);
}

router.post('/login', async (req, res) => {

    const {
        username,
        password
    } = req.body;

    let user;

    if (verifyMail(username) == true) {
        user = await pool.query("SELECT * FROM users WHERE email = $1", [username]);
    } else {
        user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    }

    if (user.rows.length > 0) {

        if (user.rows[0].active == true) {

            if (await verifyPassword(user.rows[0].password, password) === true) {

                const token = createJWT(user.rows[0].id, user.rows[0].username, user.rows[0].email, user.rows[0].type, "login");
                res.cookie('isAuth', true);
                res.cookie('token', token);
                res.cookie('username', user.rows[0].username);
                res.cookie('user_id', user.rows[0].id);

                if (user.rows[0].type == 1) {
                    res.redirect('/users/dashboard');
                } else {
                    res.redirect('/selector')
                }
            } else {
                req.session.error = "Invalid Credentials";
                req.session.save();
                res.redirect('/login');
            }

        } else {

            req.session.email = user.rows[0].email;
            req.session.username = user.rows[0].username;
            req.session.type = user.rows[0].type;
            req.session.user_id = user.rows[0].id;
            req.session.save();
            res.redirect('/register/resend');

        }

    } else {

        req.session.error = "Invalid Credentials";
        req.session.save();
        res.redirect('/login');
    }





});

module.exports = router;