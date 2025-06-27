const express = require("express");
const router = express.Router();
const {
    transporter
} = require("../../../nodejs/config/email.js");
const {
    pool
} = require("../../../nodejs/config/postgresql.js");
const pg = require("pg");
const {
    createJWT
} = require("../../../nodejs/config/jsonwebtoken.js");

function verifyMail(content) {
    const emailRegex = /^[a-zA-Z0-9._%\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(content);
}

router.post("/password/forgot", async (req, res) => {

    const mail = req.body.email;

    if (verifyMail(mail) === false) {
        req.session.error = "The email address format is not correct";
        req.session.save();
        res.redirect("/password/forgot");
    } else {
        const check = await pool.query("SELECT * FROM users WHERE email = $1", [mail]);

        if (check.rows.length > 0) {

            const token = createJWT(check.rows[0].id, check.rows[0].username, check.rows[0].email, check.rows[0].type, "reset");

            const mailoptions = {
                from: process.env.SMTP_USERNAME,
                to: mail,
                subject: "Password Change",
                html: `<h1>Password Change</h1> </br> <a href="${process.env.link}/password/reset?token=${token}">Click Here</a>`
            }

            await transporter.sendMail(mailoptions);

            res.render("password_reset/password_mail.ejs", {
                username: check.rows[0].username
            });

        } else {
            req.session.error = "No user with this email address exists.";
            req.session.save();
            res.redirect("/password/forgot");
        }
    }

});

module.exports = router;