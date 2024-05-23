const axios = require("axios");
const CryptoJS = require("crypto-js");
const { encodeUserBasket, prepareParams } = require("./functions");
const PayTRException = require("./PayTRException");

class PayTRClient {
  constructor(params) {
    const { client, ...rest } = params;
    this._client = client ?? axios.create();
    this._merchantParams = rest;
  }

  async getToken(params) {
    const { merchant_id, merchant_key, merchant_salt, max_installment, timeout_limit, no_installment, test_mode, debug_on } = prepareParams(this._merchantParams);
    const { user_ip, user_name, user_address, user_phone, merchant_oid, email, payment_amount, currency, merchant_ok_url, merchant_fail_url } = prepareParams(params);

    const user_basket = encodeUserBasket(params.user_basket);

    const paytr_token = this.calculateHash([merchant_id, user_ip, merchant_oid, email, payment_amount, user_basket, no_installment, max_installment, currency, test_mode, merchant_salt], merchant_key);

    const data = { merchant_id, user_ip, merchant_oid, email, payment_amount, paytr_token, user_basket, debug_on, no_installment, max_installment, user_name, user_address, user_phone, merchant_ok_url, merchant_fail_url, timeout_limit, currency, test_mode };

    const request = { method: "POST", url: "https://www.paytr.com/odeme/api/get-token", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: new URLSearchParams(data), responseType: "json" };

    const response = await this._client.request(request);

    if (typeof response.data !== "object") {
      throw new PayTRException("Invalid response received from PayTR", response);
    }

    if (response.data.status === "success") {
      return { token: response.data.token };
    }

    throw new PayTRException(response.data.reason ?? "PayTR get token request failed", response);
  }

  async directApi(params) {
    const { merchant_id, merchant_key, merchant_salt, timeout_limit, installment_count, non_3d, test_mode, debug_on, sync_mode, lang } = prepareParams(this._merchantParams);
    const { user_ip, user_name, user_address, user_phone, merchant_oid, email, payment_amount, payment_type, currency, cc_owner, card_number, expiry_month, expiry_year, cvv, merchant_ok_url, merchant_fail_url } = prepareParams(params);

    const user_basket = encodeUserBasket(params.user_basket);

    const paytr_token = this.calculateHash([merchant_id, user_ip, merchant_oid, email, payment_amount, payment_type, installment_count, currency, test_mode, non_3d, merchant_salt], merchant_key);

    const data = { merchant_id, paytr_token, user_ip, merchant_oid, email, payment_type, payment_amount, installment_count, non_3d, cc_owner, lang, card_number, expiry_month, expiry_year, cvv, merchant_ok_url, merchant_fail_url, user_name, user_address, user_phone, user_basket, debug_on, timeout_limit, currency, test_mode, sync_mode };

    const request = { method: "POST", url: "https://www.paytr.com/odeme", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: new URLSearchParams(data), responseType: "json" };

    const response = await this._client.request(request);

    if (typeof response.data !== "object") {
      throw new PayTRException("Invalid response received from PayTR", response);
    }

    if (response.data.status === "success") {
      return { token: response.data.token };
    }

    throw new PayTRException(response.data.reason ?? "PayTR get token request failed", response);
  }

  validateCallback(params) {
    const { merchant_key, merchant_salt } = this._merchantParams;
    const { hash, merchant_oid, status, total_amount } = params;
    const calculatedHash = this.calculateHash([merchant_oid, merchant_salt, status, total_amount], merchant_key);
    return hash === calculatedHash;
  }

  async refund(params) {
    const { merchant_id, merchant_key, merchant_salt } = prepareParams(this._merchantParams);
    const { merchant_oid, return_amount, reference_no } = prepareParams(params);

    const paytr_token = this.calculateHash([merchant_id, merchant_oid, return_amount, merchant_salt], merchant_key);

    const data = { merchant_id, merchant_oid, return_amount, paytr_token, reference_no };

    const request = { method: "POST", url: "https://www.paytr.com/odeme/iade", headers: { "Content-Type": "application/x-www-form-urlencoded" }, data: new URLSearchParams(data), responseType: "json" };

    const response = await this._client.request(request);

    if (typeof response.data !== "object") {
      throw new PayTRException("Invalid response received from PayTR", response);
    }

    if (response.data.status === "error") {
      throw new PayTRException(response.data.err_msg ?? "PayTR request failed", response);
    }

    return { status: response.data.status, isTest: response.data.is_test == 1, referenceNo: response.data.reference_no, merchantOid: response.data.merchant_oid, returnAmount: response.data.return_amount };
  }

  calculateHash(data, key) {
    const hash = CryptoJS.HmacSHA256(data.join(''), key);
    return hash.toString(CryptoJS.enc.Base64);
  }
}

module.exports = PayTRClient;
