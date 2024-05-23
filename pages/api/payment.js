import fetch from 'node-fetch';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

export default async (req, res) => {
  try {
    const {
      email,
      cc_owner,
      card_number,
      expiry_month,
      expiry_year,
      cvv,
      user_name,
      user_address,
      user_phone,
    } = req.body;

    // Diğer gerekli bilgileri ayarla
    const merchant_id = '307436';
    const merchant_key = 'AHwq2AFc4SfeMYgG';
    const merchant_oid = uuidv4();
    const user_ip = '66.249.70.173';
    const payment_amount = 100.00; // Örnek olarak 100.00 TL olarak ayarlandı
    const payment_type = 'card';
    const installment_count = 0;
    const card_type = 'maximum';
    const currency = 'TL';
    const client_lang = 'tr'; 

    // PAYTR token'ı oluşturmak için gerekli verileri birleştir
    const tokenData = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${payment_type}${installment_count}${currency}`;

    // SHA256 ile hash oluştur
    const sha256Hash = crypto.createHash('sha256').update(tokenData).digest('hex');

    // HMAC ile şifrele ve base64'e dönüştür
    const hmac = crypto.createHmac('sha256', merchant_key).update(sha256Hash).digest('base64');

    // POST isteği için gerekli bilgileri birleştir
    const postData = {
      merchant_id,
      paytr_token: hmac,
      user_ip,
      merchant_oid,
      email,
      payment_type,
      payment_amount: payment_amount.toFixed(2), // Düzeltildi
      installment_count,
      card_type,
      currency,
      client_lang,
      cc_owner,
      card_number,
      expiry_month,
      expiry_year,
      cvv,
      merchant_ok_url: 'https://localhost/success', // Müşterinin başarılı ödeme sonrası yönlendirileceği URL
      merchant_fail_url: 'https://localhost/failed', // Müşterinin ödemesi sırasında beklenmeyen bir hatada yönlendirileceği URL
      user_name,
      user_address,
      user_phone,
      user_basket: [{ "product": "Test Ürünü", "price": payment_amount.toFixed(2) }], // JSON formatına uygun hale getirildi
    };

    // POST isteği yapılacak URL
    const url = 'https://www.paytr.com/odeme';

    console.log(postData);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'merchant-key': merchant_key
      },
      body: JSON.stringify(postData)
    });

    // Yanıtı al ve JSON olarak dönüştür
    const responseData = await response.json();
    // Yanıtı console'a yazdır
    console.log(response);
    console.log('Response:', responseData);

    // Yanıtı gönder
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Ödeme işlemi sırasında bir hata oluştu:', error);
    res.status(500).json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' });
  }
};
