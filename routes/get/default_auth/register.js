const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {


    if (req.cookies.token && req.cookies.isAuth === "true") {
        res.redirect('/selector');
    } else {
        res.render('default_auth/register.ejs', {
            error: req.session.error
        });
        req.session.error = null;
    }

});

module.exports = router;