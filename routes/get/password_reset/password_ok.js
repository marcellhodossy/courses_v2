const express = require('express');
const router = express.Router();

router.get('/password/ok', (req, res) => {

    if (req.cookies.isAuth === "true") {
        res.clearCookie('token');
        res.render("password_ok.ejs")
    } else {
        const referer = req.get('referer') || '/';
        res.redirect(referer);
    }

});

module.exports = router;