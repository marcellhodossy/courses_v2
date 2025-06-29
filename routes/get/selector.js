const express = require('express');
const { verifyJWT } = require('../../config/jsonwebtoken');
const router = express.Router();

router.get('/selector', async (req, res) => {

const decoded = await verifyJWT(req.cookies.token);

if(req.cookies.isAuth === 'true' && decoded.id > 0) {
    res.render('selector.ejs', {username: req.cookies.username});
} else {
    res.redirect('/login');
}

});

module.exports = router;