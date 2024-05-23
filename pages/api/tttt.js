import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export default async (req, res) => {
  try {
    const {
      email,
    } = req.body;

    // Sabit merchant_id
    const merchant_id = '307436';
    const secret_key = 'AHwq2AFc4SfeMYgG';
    // Merchant_oid'yi UUID ile oluştur
    const merchant_oid = uuidv4();

    // Kullanıcı IP'sini al
    const user_ip = req.connection.remoteAddress;

    // payment_amount sabit olarak 100
    const payment_amount = 100;

    // payment_type sabit olarak "card"
    const payment_type = "card";

    // installment_count sabit olarak 0
    const installment_count = 0;

    // currency sabit olarak "TL"
    const currency = "TL";

    // test_mode sabit olarak 0
    const test_mode = 0;

    // non_3d sabit olarak 0
    const non_3d = 0;

    // Gerekli verileri kontrol et
    if (!user_ip || !email) {
      return res.status(400).json({ error: 'Eksik veya hatalı bilgi. Lütfen tüm alanları doldurun.' });
    }

    // Token üretiminde kullanılacak verileri birleştir
    const tokenData = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}${test_mode}${non_3d}`;

    // SHA256 ile hash oluştur
    const sha256Hash = crypto.createHash('sha256').update(tokenData).digest('hex');

    // HMAC ile şifrele ve base64'e dönüştür
    const hmac = crypto.createHmac('sha256', secret_key).update(sha256Hash).digest('base64');

    // Oluşturulan token'i dön
    res.status(200).json({ token: hmac });
  } catch (error) {
    console.error('Token oluşturulurken bir hata oluştu:', error);
    res.status(500).json({ error: 'Token oluşturulurken bir hata oluştu.' });
  }
};
