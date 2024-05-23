// functions.js
function calculateHash(data, key) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(data.join(''));
    return hmac.digest('base64');
  }
  
  function encodeUserBasket(userBasket) {
    return Buffer.from(JSON.stringify(userBasket)).toString('base64');
  }
  
  function prepareParams(params) {
    const preparedParams = {};
    for (const key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        preparedParams[key] = params[key];
      }
    }
    return preparedParams;
  }
  
  module.exports = {
    calculateHash,
    encodeUserBasket,
    prepareParams
  };
  