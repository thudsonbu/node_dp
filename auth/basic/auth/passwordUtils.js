const crypto = require('crypto');

module.exports = {
  validatePassword( password, hash, salt ) {
    const reqHash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');

    return reqHash === hash;
  },

  genPassword( password ) {
    const salt = crypto.randomBytes( 32 ).toString('hex');

    const hash = crypto.pbkdf2Sync(
      password,
      salt,
      10000,
      64,
      'sha512'
    ).toString('hex');

    return {
      salt,
      hash
    };
  }
};
