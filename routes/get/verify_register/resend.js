const express = require('express');
const router = express.Router();
const pg = require('pg');
const {
    transporter
} = require('../../../config/email.js')
const {
    createJWT
} = require('../../../config/jsonwebtoken.js');

router.get('/register/resend', async (req, res) => {

    if (req.session.user_id && req.session.username && req.session.email && req.session.type) {

        var token = createJWT(req.session.user_id, req.session.username, req.session.email, req.session.type);

        let mailoptions = {
            from: process.env.SMTP_USERNAME,
            to: req.session.email,
            subject: 'Confirm registration',
            html: `<h1>Confirm Registration</h1> </br> <a href="${process.env.LINK}/register/verify?token=${token}">Click Here</a>`
        }

        await transporter.sendMail(mailoptions);
        res.render("verify_register/resend.ejs", {
            username: req.session.username
        });
        req.session.destroy();


    } else {
        const referer = req.get('referer') || '/';
        res.redirect(referer);
    }
});

module.exports = router;