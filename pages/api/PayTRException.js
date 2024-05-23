// PayTRException.js
class PayTRException extends Error {
    constructor(message, response) {
      super(message);
      this.name = 'PayTRException';
      this.response = response;
    }
  }
  
  module.exports = PayTRException;
  