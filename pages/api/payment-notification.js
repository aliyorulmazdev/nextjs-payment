import crypto from 'crypto';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const {
      merchant_oid,
      status,
      total_amount,
      hash,
    } = req.body;

    const merchant_salt = 'frwRCBTbu3BMn52T';

    const hash_str = `${merchant_oid}${merchant_salt}${status}${total_amount}`;
    const calculated_hash = crypto.createHash('sha256').update(hash_str).digest('hex');

    if (calculated_hash === hash) {
      // Ödeme başarılı veya başarısız işleme
      if (status === 'success') {
        // Ödeme başarılı
        console.log(`Payment successful for order ${merchant_oid}`);
        res.writeHead(307, { Location: '/success' });
      } else {
        // Ödeme başarısız
        res.writeHead(307, { Location: '/fail' });
        console.log(`Payment failed for order ${merchant_oid}`);
      }
      res.status(200).send('OK');
    } else {
      res.status(400).send('Invalid hash');
    }
  } else if (req.method === 'GET') {
    // GET istekleri /success sayfasına yönlendirilir
    res.writeHead(307, { Location: '/success' });
    res.end();
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
