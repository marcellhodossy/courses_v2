const express = require('express');
const router = express.Router();
const {pool} = require('../config/postgresql.js');
const {transporter} = require('../config/transporter.js');

router.get('/', (req, res) => {
    if(req.cookies.token) {
        redirect('/')
    } else {
    res.render('login.ejs', {
        error: req.session.error
    });
    req.session.error = null;
    req.session.save();
}
});

module.exports = router;