"use client";
import { useState } from "react";
import axios from "axios";

export default function PaymentForm() {
  const [formData, setFormData] = useState({
    email: "",
    cc_owner: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    user_name: "",
    user_address: "",
    user_phone: "",
    merchant_oid: "",
    payment_amount: 0,
    payment_type: "card",
    merchant_id: "",
    user_ip: "",
    non_3d: 0,    
    installment_count:0,
    currency: "TL"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/payment", formData);
      console.log("Ödeme işlemi başarılı:", response.data);
      // Ödeme tamamlandıktan sonra yönlendirme vb. işlemleri burada yapabilirsin
    } catch (error) {
      console.error("Ödeme işlemi sırasında bir hata oluştu:", error.message);
      // Hata durumunda kullanıcıya uygun bir mesaj gösterebilirsin
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="max-w-md bg-white p-8 rounded shadow-md w-full">
        <h2 className="text-2xl mb-4 font-bold text-gray-800">
          Ödeme Bilgileri
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-bold mb-2"
            >
              E-posta:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cc_owner"
              className="block text-gray-700 font-bold mb-2"
            >
              Kart Sahibi:
            </label>
            <input
              type="text"
              name="cc_owner"
              id="cc_owner"
              value={formData.cc_owner}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              maxLength={50}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="card_number"
              className="block text-gray-700 font-bold mb-2"
            >
              Kart Numarası:
            </label>
            <input
              type="text"
              name="card_number"
              id="card_number"
              value={formData.card_number}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              maxLength={16}
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry_month"
                className="block text-gray-700 font-bold mb-2"
              >
                Son Kullanma Tarihi (Ay):
              </label>
              <input
                type="text"
                name="expiry_month"
                id="expiry_month"
                value={formData.expiry_month}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded"
                maxLength={2}
                required
              />
            </div>
            <div>
              <label
                htmlFor="expiry_year"
                className="block text-gray-700 font-bold mb-2"
              >
                Son Kullanma Tarihi (Yıl):
              </label>
              <input
                type="text"
                name="expiry_year"
                id="expiry_year"
                value={formData.expiry_year}
                onChange={handleChange}
                className="border border-gray-300 p-2 w-full rounded"
                maxLength={2}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="cvv" className="block text-gray-700 font-bold mb-2">
              CVV:
            </label>
            <input
              type="text"
              name="cvv"
              id="cvv"
              value={formData.cvv}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              maxLength={3}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="user_name"
              className="block text-gray-700 font-bold mb-2"
            >
              Müşteri Adı Soyadı:
            </label>
            <input
              type="text"
              name="user_name"
              id="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              maxLength={60}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="user_address"
              className="block text-gray-700 font-bold mb-2"
            >
              Müşteri Adresi:
            </label>
            <textarea
              name="user_address"
              id="user_address"
              value={formData.user_address}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              rows={4}
              maxLength={400}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="user_phone"
              className="block text-gray-700 font-bold mb-2"
            >
              Müşteri Telefon Numarası:
            </label>
            <input
              type="text"
              name="user_phone"
              id="user_phone"
              value={formData.user_phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 w-full rounded"
              maxLength={20}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Ödemeyi Tamamla
          </button>
        </form>
      </div>
    </div>
  );
}
