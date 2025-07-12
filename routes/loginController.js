const express = require('express');
const router = express.Router();
const {pool} = require('../config/postgresql.js');
const pg = require('pg');
const {hashPassword, verifyPassword} = require('../config/argon.js');
const { createJWT } = require('../config/jsonwebtoken.js');

router.post('/login', async (req, res) => {
    const {username, password} = req.body

    if(username < 1)
    {
        req.session.error = "Username is required.";
        req.session.save();
        res.redirect('/');
    } else if(password.length < 1)
    {
        req.session.error = "Password is required.";
        req.session.save();
        res.redirect('/');
    } else {
        const data = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
        
        if(data.rows.length > 0) {
            
            if(data.rows[0].token_value > 0) {

                const status = await verifyPassword(data.rows[0].password, password);

                if(status == false) {
                            req.session.error = "Invalid Credentials";
                            req.session.save();
                            res.redirect('/');
                } else {
                    const token = await createJWT(data.rows[0].id, data.rows[0].token_value);
                    res.cookie("token", token);
                    res.redirect('/users/');
                }

            } else {
                req.session.user_id = data.rows[0].id;
                req.session.save();
                res.redirect('/verify/resend');
            }
            

        } else {
        req.session.error = "Invalid Credentials";
        req.session.save();
        res.redirect('/');
        }
    }



    


});

module.exports = router;
