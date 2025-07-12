const argon2 = require('argon2');

async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password);
    console.log('Hashed password:', hash);
    return hash;
  } catch (err) {
    console.error('Hashing error:', err);
  }
}

async function verifyPassword(hash, input) {
  try {
    if (await argon2.verify(hash, input)) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error('Verification error:', err);
  }
}

module.exports = {verifyPassword, hashPassword};