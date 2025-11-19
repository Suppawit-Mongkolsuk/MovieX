import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '../base/Button';

interface CardPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  onConfirm: () => void;
}

const inputBase =
  'w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm sm:text-base text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amber-400 transition';

export default function CardPaymentDialog({
  open,
  onOpenChange,
  onConfirm,
}: CardPaymentDialogProps) {
  // state สำหรับข้อมูลบัตรจำลอง + error แสดงใต้ฟอร์ม
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');

  // helper format หมายเลขบัตร ใส่ช่องว่างทุก 4 ตัวอักษร
  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, '$1 ');

  // helper format วันหมดอายุ -> MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  };

  // ตรวจสอบความครบถ้วนก่อนยิง onConfirm (mock)
  const handleConfirm = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      setError('กรุณากรอกข้อมูลบัตรให้ครบถ้วน');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 12) {
      setError('หมายเลขบัตรไม่ถูกต้อง');
      return;
    }

    setError('');
    onConfirm();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg sm:max-w-3xl lg:max-w-5xl -translate-x-1/2 -translate-y-1/2 rounded-[32px] border border-white/15 bg-[#0c0505]/80 p-6 sm:p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Dialog.Title className="text-2xl font-semibold">
                  ชำระด้วยบัตร
                </Dialog.Title>
                <Dialog.Description className="text-sm text-white/70">
                  ยอดที่จะชำระจะถูกตัดจากบัตรโดยอัตโนมัติหลังยืนยัน
                </Dialog.Description>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1">
                {/* การ์ด preview ด้านซ้าย: bind กับ state เพื่อให้เห็นผลทันที */}
                <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a0a0a] via-[#8b0000] to-[#f2c94c] p-5 text-white shadow-inner">
                  <div className="flex justify-between text-xs uppercase tracking-[0.4em] text-white/70">
                    <span>MOVIX</span>
                    <span>Premium</span>
                  </div>
                  <p className="text-xl font-mono tracking-[0.3em]">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </p>
                  <div className="mt-4 flex justify-between text-sm">
                    <div>
                      <p className="text-white/70 text-xs">CARD HOLDER</p>
                      <p className="font-semibold">{cardName || 'YOUR NAME'}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">EXPIRES</p>
                      <p className="font-semibold">{expiry || 'MM/YY'}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">CVV</p>
                      <p className="font-semibold">{cvv || '•••'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="grid gap-4">
                  <label className="space-y-2 text-sm">
                    <span className="text-white/70">หมายเลขบัตร</span>
                    <input
                      className={inputBase}
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      inputMode="numeric"
                      maxLength={19}
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="text-white/70">ชื่อบนบัตร</span>
                    <input
                      className={inputBase}
                      placeholder="Suppawit M."
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="space-y-2 text-sm">
                      <span className="text-white/70">วันหมดอายุ</span>
                      <input
                        className={inputBase}
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) =>
                          setExpiry(formatExpiry(e.target.value))
                        }
                        maxLength={5}
                        inputMode="numeric"
                      />
                    </label>
                    <label className="space-y-2 text-sm">
                      <span className="text-white/70">CVV</span>
                      <input
                        className={inputBase}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                        }
                        maxLength={4}
                        inputMode="numeric"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <Dialog.Close asChild>
                <Button
                  variant="danger"
                  className="w-full rounded-2xl border border-white/20 px-4 py-3 font-semibold text-white"
                >
                  ยกเลิก
                </Button>
              </Dialog.Close>
              <Button
                variant="primary"
                onClick={handleConfirm}
                className="w-full rounded-2xl px-4 py-3 font-semibold text-gray-900"
              >
                ยืนยันการชำระเงิน
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
