"use client";

import React, { createContext, useState, useContext } from "react";

interface CartAnimationContextType {
  showToast: boolean;
  toastMessage: string;
  showNotification: (message: string) => void;
  hideNotification: () => void;
}

const CartAnimationContext = createContext<
  CartAnimationContextType | undefined
>(undefined);

export function CartAnimationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const hideNotification = () => {
    setShowToast(false);
  };

  return (
    <CartAnimationContext.Provider
      value={{
        showToast,
        toastMessage,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </CartAnimationContext.Provider>
  );
}

export const useCartAnimation = () => {
  const context = useContext(CartAnimationContext);
  if (context === undefined) {
    throw new Error(
      "useCartAnimation must be used within a CartAnimationProvider"
    );
  }
  return context;
};
