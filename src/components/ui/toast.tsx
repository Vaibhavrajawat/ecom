"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, isVisible, onClose }: ToastProps) {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "100%" }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: 50, x: "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white shadow-lg"
        >
          <ShoppingCart className="h-5 w-5" />
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={onClose}
            className="ml-2 rounded-full p-1 hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
