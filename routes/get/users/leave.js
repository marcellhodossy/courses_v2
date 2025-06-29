const express = require('express');
const { pool } = require('../../../config/postgresql');
const pg = require('pg');
const { verifyJWT } = require('../../../config/jsonwebtoken');
const { decode } = require('jsonwebtoken');
const router = express.Router();

router.get('/users/course/:id/leave',async (req, res) => {

    const decoded = await verifyJWT(req.cookies.token);

    if(req.cookies.isAuth === 'true' && decoded.id > 0) {

    await pool.query("DELETE FROM courses WHERE user_id = $1 AND type = 2", [decoded.id]);
    res.redirect('/users/dashboard');
    } else {
                res.clearCookie("isAuth");
        res.clearCookie("token");
        res.redirect("/login");
    }

});

module.exports = router;