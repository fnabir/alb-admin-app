import { useEffect, useState } from 'react';
import { Toast } from './types';
import { MdClose } from 'react-icons/md';

const variantStyles = {
  success: 'border-green-500 bg-green-900',
  error: 'border-red-500 bg-red-900',
  info: 'border-sky-500 bg-sky-900',
  warning: 'border-yellow-500 bg-yellow-900',
};

const textStyles = {
  success: 'text-green-200',
  error: 'text-red-200',
  info: 'text-sky-200',
  warning: 'text-yellow-200',
};

export function ToastItem({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  return (
    <div
      className={`
        w-80 w-max-[23rem] flex transform
        transition-all duration-300 ease-in-out
        ${
          toast.closing || !visible
            ? 'translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
        }
        rounded-xl p-3 shadow-lg border
        ${variantStyles[toast.variant]}
      `}
    >
      <div className="flex-1">
        {toast.title && (
          <p className={`text-md font-medium ${textStyles[toast.variant]}`}>
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p className={`text-xs ${textStyles[toast.variant]}`}>
            {toast.description}
          </p>
        )}
      </div>
      <MdClose
        className={`size-5 cursor-pointer ${textStyles[toast.variant]}`}
        onClick={onClose}
      />
    </div>
  );
}
