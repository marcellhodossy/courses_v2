const express = require("express");
const router = express.Router();
const pg = require("pg");
const {
    pool
} = require("../../../config/postgresql.js");
const {
    verifyJWT
} = require("../../../config/jsonwebtoken.js");
const {
    hashPassword
} = require("../../../config/argon2.js");

router.post("/password/reset/", async (req, res) => {

    if (req.cookies.token) {

        const {
            password,
            retry_password
        } = req.body;

        const decoded = await verifyJWT(req.cookies.token);

        if (password !== retry_password) {
            req.session.error = "The passwords do not match.";
            req.session.save();
            res.redirect(`/password/reset?token=${req.cookies.token}`);
        } else if (password.length < 8) {
            req.session.error = "The password minimal is 8 characters";
            req.session.save();
            res.redirect(`/password/reset?token=${req.cookies.token}`);
        } else if (password.length > 32) {
            req.session.error = "The password maximal is 32 characters";
            req.session.save();
            res.redirect(`/password/reset?token=${req.cookies.token}`);
        } else {
            const encrypted_password = await hashPassword(password);
            const update = await pool.query("UPDATE users SET password = $1 WHERE id = $2", [encrypted_password, decoded.id]);
            res.redirect('/login');
        }

    } else {
        const referer = req.get('referer') || '/';
        res.redirect('referer');
    }

});

module.exports = router;