import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';

interface ConfirmRoleDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  newRole: string;
  userName: string;
}

export const ConfirmRoleDialog = ({
  open,
  onConfirm,
  onCancel,
  newRole,
  userName,
}: ConfirmRoleDialogProps) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        {/* ✅ Overlay แบบโปร่งแสงเบลอสวย */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />

        {/* ✅ กล่อง popup */}
        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="bg-white/10 backdrop-blur-md border border-white/20 
               text-white rounded-xl shadow-xl w-[90%] max-w-md p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-semibold text-center">
                ยืนยันการเปลี่ยน Role
              </Dialog.Title>
            </div>

            <p className="text-sm text-gray-200 mb-6 text-left">
              ต้องการเปลี่ยน Role ของ{' '}
              <span className="font-bold">{userName}</span> <br />
              เป็น <span className="text-yellow-400 font-bold">
                {newRole}
              </span>{' '}
              ใช่หรือไม่?
            </p>

            {/* ปุ่มยืนยัน / ยกเลิก */}
            <div className="flex justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-red-700 text-gray-200 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-movix-gold text-black font-semibold hover:bg-green-500 transition"
              >
                ยืนยัน
              </button>
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
