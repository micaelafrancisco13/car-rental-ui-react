import React, { useState } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { formatMoney } from '../utils/helper';

interface EditableBalanceCellProps {
  initialValue: number;
  total: number;
  onSave: (value: number) => void;
  disabled?: boolean;
}

const EditableBalanceCell: React.FC<EditableBalanceCellProps> = ({
  initialValue,
  total,
  onSave,
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState((initialValue).toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setValue(initialValue.toString());
    setIsEditing(false);
  };

  const handleSave = async () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setValue(initialValue.toString());
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      await onSave(numValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
      setValue(initialValue.toString());
    } finally {
      setIsLoading(false);
    }
  };
  const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
      {children}
    </div>
  );

  if (isEditing) {
    return (
        <>
        <Dialog open={isEditing} onClose={handleCancel} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />

            <div className="fixed text-black inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                    <div>
                        
                    <div className='mb-1'>
                        Total amount: {formatMoney(total)}
                    </div>
                    <div className='mb-1'>
                        Remaining balance: {formatMoney(initialValue)}
                    </div>
                    <div className='mb-1'>
                        Enter Amount
                    </div>
                    <div className="flex items-center space-x-2">
                        
                        <input
                        type="number"
                        value={value}
                        max={initialValue}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-24 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                            handleSave();
                            }
                        }}
                        />
                        <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="p-1 text-green-600 hover:text-green-700 disabled:opacity-50"
                        >
                        <Check size={16} />
                        </button>
                        <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                        <X size={16} />
                        </button>
                    </div>
                    </div>
                    <div className="mt-5 sm:mt-6">
                    </div>
                </DialogPanel>
                </div>
            </div>
            </Dialog>
       </>
    );
  }

  return (
    <div className="flex items-center group">
      <span className="text-sm text-gray-900">{formatMoney(initialValue)}</span>
      {!disabled && (
        <div className="relative group ml-2">
        <button
          onClick={handleEdit}
          className="p-1 text-gray-400 opacity-50 group-hover:opacity-100 hover:text-gray-600"
        >
          <Edit2 size={16} />
        </button>
        <Tooltip>
          Enter payment amount to update balance
        </Tooltip>
      </div>
      )}
    </div>
  );
};

export default EditableBalanceCell;