const express = require('express');
const router = express.Router();
const {
    verifyJWT,
    createJWT
} = require('../../../nodejs/config/jsonwebtoken.js');
const pg = require('pg');
const {
    pool
} = require('../../../nodejs/config/postgresql.js');

router.get('/register/verify', async (req, res) => {

    const token = req.query.token;
    const decoded = await verifyJWT(token);

    if (decoded.type > 0) {
        const update = pool.query("UPDATE users SET active = true WHERE id = $1", [decoded.id]);
        res.cookie('token', token);
        res.cookie('isAuth', true);
        res.redirect('/dashboard');
    } else {
        req.session.error = "Your token has expired or is invalid.";
        req.session.save();
        res.redirect("/login");
    }

});

module.exports = router;