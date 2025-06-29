const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    verifyJWT
} = require('../../../config/jsonwebtoken.js');

router.get("/password/reset/", async (req, res) => {

    const token = req.query.token;
    const decoded = await verifyJWT(token);

    if (decoded.type > 0) {
        res.cookie("token", token);
        res.render("password_reset/password_reset.ejs", {
            error: req.session.error
        });

    } else {
        req.session.error = "Your token has expired or is invalid.";
        req.session.save();
        res.redirect('/password/forgot');
    }

});

module.exports = router;