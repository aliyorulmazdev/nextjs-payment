"use client"
import { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import UUID v4

export default function Payment() {
  const [iframeToken, setIframeToken] = useState('');

  const generateRandomOID = () => {
    return uuidv4(); // Generate random UUID
  };

  const getToken = async () => {
    try {
      const oid = generateRandomOID(); // Generate random OID
      const response = await axios.post('/api/get-token', {
        user_ip: '1.2.3.4',
        merchant_oid: oid, // Use generated OID
        email: 'customer@example.com',
        payment_amount: 1800,
        currency: 'TL',
        user_basket: [
          ['Örnek Ürün 1', '18.00', 1],
        ],
        no_installment: 0,
        max_installment: 12,
        user_name: 'John Doe',
        user_address: '123 Main St',
        user_phone: '05555555555',
        merchant_ok_url: 'https://nextjs-paytr-payment-test.vercel.app/api/payment-notification',
        merchant_fail_url: 'https://nextjs-paytr-payment-test.vercel.app/fail'
      });

      setIframeToken(response.data.token);
    } catch (error) {
      console.error('Error getting token:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      <button onClick={getToken}>Get Token</button>
      {iframeToken && (
        <div>
          <script src="https://www.paytr.com/js/iframeResizer.min.js"></script>
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${iframeToken}`}
            id="paytriframe"
            frameBorder="0"
            scrolling="no"
            style={{ width: '100%', height:'100vh'}} // Set height to 100vh
          ></iframe>
          <script>iFrameResize({}, '#paytriframe');</script>
        </div>
      )}
    </div>
  );
}
