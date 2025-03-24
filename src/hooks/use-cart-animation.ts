import { useState, useCallback } from "react";

export function useCartAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationConfig, setAnimationConfig] = useState<{
    productPosition: { x: number; y: number };
    cartPosition: { x: number; y: number };
  } | null>(null);

  const startAnimation = useCallback((productElement: HTMLElement) => {
    // Get cart icon element
    const cartIcon = document.querySelector(".cart-icon") as HTMLElement;
    if (!cartIcon) return;

    // Get positions
    const productRect = productElement.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Set animation configuration
    setAnimationConfig({
      productPosition: {
        x: productRect.left + productRect.width / 2 - 12,
        y: productRect.top + productRect.height / 2 - 12,
      },
      cartPosition: {
        x: cartRect.left + cartRect.width / 2 - 12,
        y: cartRect.top + cartRect.height / 2 - 12,
      },
    });

    // Start animation
    setIsAnimating(true);
  }, []);

  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    setAnimationConfig(null);
  }, []);

  return {
    isAnimating,
    animationConfig,
    startAnimation,
    stopAnimation,
  };
}
