const express = require("express");
const router = express.Router();

router.get('/password/forgot', (req, res) => {

    if (req.cookies.isAuth == 'true') {
        res.redirect('/dashboard');
    } else {
        res.render('password_reset/password_forgot.ejs', {
            error: req.session.error
        });
        req.session.error = null;
        req.session.save();
    }
});

module.exports = router;