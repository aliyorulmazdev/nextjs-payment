import crypto from 'crypto';
import axios from 'axios';
import { encode as base64_encode } from 'nodejs-base64-converter';

// Define merchant credentials
const merchant_id = '307436';
const merchant_key = 'AHwq2AFc4SfeMYgG';
const merchant_salt = 'frwRCBTbu3BMn52T';
const test_mode = '0'; // Changed to string as in the provided data

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      currency,
      user_basket,
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url
    } = req.body;

    // Log received data
    console.log('Received data:', req.body);

    // Constructing the hash string in the required format
    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${base64_encode(user_basket)}${no_installment}${max_installment}${currency}${test_mode}${merchant_salt}`;

    // Calculate PayTR token
    const paytr_token = crypto.createHmac('sha256', merchant_key).update(hash_str).digest('base64');

    // Log calculated token and hash string
    console.log('Hash string:', hash_str);
    console.log('PayTR token:', paytr_token);

    // Constructing the payload in the required format
    const payload = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount,
      currency,
      user_basket: base64_encode(user_basket),
      no_installment,
      max_installment,
      user_name,
      user_address,
      user_phone,
      merchant_ok_url,
      merchant_fail_url,
      test_mode, // Adding test_mode to the payload
      paytr_token
    });


    try {
      const response = await axios.post('https://www.paytr.com/odeme/api/get-token', payload.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      });

      res.status(200).json(response.data);
    } catch (error) {
      // Log detailed error information
      console.error('Error response:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Only POST requests are allowed' });
  }
}
