const jwt = require('jsonwebtoken');
const pg = require('pg');
const {
    pool
} = require('./postgresql');

function createJWT(id, username, email, type, token_type) {

    let expire = 0;

    if (token_type != "login") {
        expire = "30m";
    } else {
        expire = "30d";
    }

    return jwt.sign({
        id: id,
        username: username,
        email: email,
        type: type
    }, process.env.JSONWEBTOKEN_SECRET, {
        expiresIn: expire
    });
}

async function verifyJWT(token) {
    try {
        const decoded = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET);

        const check = await pool.query("SELECT * FROM users WHERE id = $1", [decoded.id]);

        if (check.rows.length > 0) {

            return {
                id: decoded.id,
                type: decoded.type
            };

        } else {
            return 0;

        }


    } catch (err) {
        return 0;
    }
}

module.exports = {
    verifyJWT,
    createJWT
};