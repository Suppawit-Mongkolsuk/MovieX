import Button from '../base/Button';

interface QRCodePopupProps {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const QRCodePopup: React.FC<QRCodePopupProps> = ({
  amount,
  onConfirm,
  onCancel,
}) => {
  const promptpayId = '0917127963';
  const qrCodeUrl = `https://promptpay.io/${promptpayId}/${amount}`;

  return (
    <div
      className="
      fixed inset-0 w-screen h-screen 
      flex items-center justify-center 
      z-50
      
    "
    >
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

        <div className="flex flex-wrap justify-center gap-3 pt-1 mt-4">
          <Button onClick={onCancel} variant="danger">
            ยกเลิก
          </Button>
          <Button onClick={onConfirm} variant="primary">
            ยืนยัน
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;
