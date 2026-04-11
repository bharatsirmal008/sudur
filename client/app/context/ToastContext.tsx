"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  confirm: (options: Omit<ConfirmState, 'isOpen'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((options: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmState({ ...options, isOpen: true });
  }, []);

  const closeConfirm = () => {
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, confirm }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl shadow-2xl border flex items-center gap-4 bg-white/80 backdrop-blur-xl ${
                toast.type === 'success' ? 'border-green-100' : 
                toast.type === 'error' ? 'border-rose-100' : 
                toast.type === 'warning' ? 'border-amber-100' : 'border-blue-100'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${
                toast.type === 'success' ? 'bg-green-50 text-green-600' : 
                toast.type === 'error' ? 'bg-rose-50 text-rose-600' : 
                toast.type === 'warning' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                {toast.type === 'error' && <XCircle className="w-5 h-5" />}
                {toast.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                {toast.type === 'info' && <Info className="w-5 h-5" />}
              </div>
              <p className="text-sm font-bold text-slate-700 flex-1">{toast.message}</p>
              <button 
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmState.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[210] overflow-y-auto"
              onClick={() => {
                confirmState.onCancel();
                closeConfirm();
              }}
            />
            <div className="fixed inset-0 z-[211] flex items-center justify-center p-4 pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="pointer-events-auto w-full max-w-md bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden"
              >
                <div className="p-8">
                  <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center ${
                    confirmState.isDestructive ? 'bg-rose-50 text-rose-600' : 'bg-[#16A34A]/10 text-[#16A34A]'
                  }`}>
                    {confirmState.isDestructive ? <AlertCircle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-[#111827] mb-2">{confirmState.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{confirmState.message}</p>
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button 
                    onClick={() => {
                      confirmState.onCancel();
                      closeConfirm();
                    }}
                    className="flex-1 py-4 font-black text-slate-400 hover:text-[#111827] transition-all uppercase text-xs tracking-widest"
                  >
                    {confirmState.cancelText || 'Cancel'}
                  </button>
                  <button 
                    onClick={() => {
                      confirmState.onConfirm();
                      closeConfirm();
                    }}
                    className={`flex-[2] py-4 font-black text-white rounded-[15px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      confirmState.isDestructive ? 'bg-rose-600 shadow-rose-100' : 'bg-[#16A34A] shadow-green-100'
                    }`}
                  >
                    {confirmState.confirmText || 'Confirm'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
