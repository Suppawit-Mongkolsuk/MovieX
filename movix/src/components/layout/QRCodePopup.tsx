import React from 'react';

interface QRCodePopupProps {
  amount: number;
  onConfirm: () => void;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({ amount, onConfirm }) => {
  const promptpayId = '0917127963';
  const qrCodeUrl = `https://promptpay.io/${promptpayId}/${amount}`;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          สแกนเพื่อชำระเงิน
        </h2>

        <img
          src={qrCodeUrl}
          alt="PromptPay QR Code"
          className="w-64 h-64 mx-auto"
        />

        <div className="text-gray-600 mt-4 text-lg font-medium">
          <p>ยอดชำระ: {amount} บาท</p>
        </div>

        <button
          onClick={onConfirm}
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition"
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default QRCodePopup;
