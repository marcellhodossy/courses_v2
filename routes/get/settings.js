const express = require('express');
const {
    verifyJWT
} = require('../../config/jsonwebtoken');
const router = express.Router();

router.get('/settings', async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);

    if (req.cookies.isAuth === 'true' && decoded.id > 0) {
        res.render('settings.ejs', {
            error: req.session.error,
            success: req.session.success
        });
        req.session.error = null;
        req.session.success = null;
        req.session.save();
    } else {
        res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

module.exports = router;