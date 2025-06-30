const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    pool
} = require('../../../config/postgresql.js');
const {
    hashPassword
} = require('../../../config/argon2.js');

function verifyMail(content) {
    const emailRegex = /^[a-zA-Z0-9._%\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(content);
}

router.post('/register', async (req, res) => {

    const {
        username,
        email,
        password
    } = req.body;

    if (username.length > 100) {
        req.session.error = "The username maximal length is 32 characters";
        req.session.save();
        res.redirect('/register');
    } else if (username.length < 8) {
        req.session.error = "The username minimal length is 8 characters";
        req.session.save();
        res.redirect('/register');
    } else if (verifyMail(email) == false) {
        req.session.error = "The email format is wrong";
        req.session.save();
        res.redirect('/register');
    } else if (email.length > 100) {
        req.session.error = "The email maximal length is 100 characters";
        req.session.save();
        res.redirect('/register');
    } else if (password.length < 8) {
        req.session.error = "The password minimal length is 8 characters";
        req.session.save();
        res.redirect('/register');
    } else if (password.length > 32) {
        req.session.error = "The password maximal length is 32 characters";
        req.session.save();
        res.redirect('/register');
    } else {

        const check_username = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (check_username.rows.length > 0) {
            req.session.error = "The username is taken";
            req.session.save();
            res.redirect('/register');
        }

        const check_email = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (check_email.rows.length > 0) {
            req.session.error = "The email is taken";
            req.session.save();
            res.redirect('/register');
        }

        const encrypted_password = await hashPassword(password);

        const insert = await pool.query("INSERT INTO users (username, email, password, type) VALUES ($1, $2, $3, 1) RETURNING id", [username, email, encrypted_password]);

        req.session.email = email;
        req.session.username = username;
        req.session.type = 1;
        req.session.user_id = insert.rows[0].id;
        req.session.save();
        res.redirect('/register/resend');

    }
});

module.exports = router;