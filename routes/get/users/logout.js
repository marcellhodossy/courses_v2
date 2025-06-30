const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('token');
    res.clearCookie('username');
    res.clearCookie('isAuth');
    res.clearCookie('user_id');
    res.redirect('/users');
});

module.exports = router;