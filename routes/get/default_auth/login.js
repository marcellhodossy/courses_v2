const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {


    if (req.cookies.token && req.cookies.isAuth === 'true') {
        res.redirect('/selector');
    } else {
        res.render('default_auth/login.ejs', {
            error: req.session.error
        });
        req.session.error = null;
    }

});

module.exports = router;