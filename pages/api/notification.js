export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  
    const { merchant_oid, status, total_amount } = req.body;
    const { merchant_key, merchant_salt } = process.env; // Get these values from environment variables
  
    // Validate hash
    const hashParams = merchant_oid + merchant_salt + status + total_amount;
    const generatedHash = crypto.createHmac('sha256', merchant_key).update(hashParams).digest('base64');
    if (req.headers['hash'] !== generatedHash) {
      return res.status(400).json({ error: 'PAYTR notification failed: bad hash' });
    }
  
    // Process notification based on status
    if (status === 'success') {
      // Perform actions for successful payment
      res.status(200).send('OK');
    } else {
      // Perform actions for failed payment
      res.status(200).send('OK');
    }
  }
  