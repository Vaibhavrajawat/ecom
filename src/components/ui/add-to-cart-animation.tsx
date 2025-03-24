"use client";

import { useCartAnimation } from "@/contexts/CartAnimationContext";
import { Toast } from "./toast";

export function AddToCartAnimation() {
  const { showToast, toastMessage, hideNotification } = useCartAnimation();

  return (
    <Toast
      message={toastMessage}
      isVisible={showToast}
      onClose={hideNotification}
    />
  );
}
