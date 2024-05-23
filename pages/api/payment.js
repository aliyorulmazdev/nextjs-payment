import axios from 'axios';
const PayTRClient = require('./PayTRClient');

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

    // PayTRClient örneğini oluştur
    const paytrClient = new PayTRClient({
      merchant_id: '307436',
      merchant_key: 'AHwq2AFc4SfeMYgG',
      merchant_salt: 'frwRCBTbu3BMn52T',
      client: axios.create(),
    });

    // Ödeme isteğini gönder
    const paymentResponse = await paytrClient.directApi({
      user_ip: '66.249.70.173',
      user_name,
      user_address,
      user_phone,
      merchant_oid: '123123123123', // Sipariş ID'sini buraya yerleştirin
      email,
      payment_amount: '100.00', // Ödeme tutarını buraya yerleştirin
      payment_type: 'card', // Ödeme tipini buraya yerleştirin (ör. 'card')
      currency: 'TL', // Para birimini buraya yerleştirin (ör. 'TL')
      cc_owner,
      card_number,
      expiry_month,
      expiry_year,
      cvv,
      merchant_ok_url: 'http://localhost/success', // Başarılı ödeme durumunda yönlendirilecek URL
      merchant_fail_url: 'http://localhost/failed', // Başarısız ödeme durumunda yönlendirilecek URL
      user_basket: [{ product: 'Test Ürünü', price: '100.00' }], // Ürün bilgisini buraya yerleştirin
      sync_mode: 0
    });

    // Ödeme yanıtını gönder
    res.status(200).json(paymentResponse);
  } catch (error) {
    console.error('Ödeme işlemi sırasında bir hata oluştu:', error);
    res.status(500).json({ error: 'Ödeme işlemi sırasında bir hata oluştu.' });
  }
};
