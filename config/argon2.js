const argon2 = require('argon2');

async function hashPassword(password) {

    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err) {
        console.error("hash error", err);
        throw err;
    }

}

async function verifyPassword(hash, password) {
    try {
        if (await argon2.verify(hash, password)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.error("verify error", err);
        return false;
    }
}

module.exports = {
    hashPassword,
    verifyPassword
};