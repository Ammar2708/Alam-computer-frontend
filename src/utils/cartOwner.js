const GUEST_CART_ID_KEY = "alam-computer-guest-cart-id";

const createObjectId = () => {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

export const getGuestCartId = () => {
  if (typeof window === "undefined") return "000000000000000000000000";
  let guestCartId = localStorage.getItem(GUEST_CART_ID_KEY);

  if (!/^[a-f0-9]{24}$/i.test(guestCartId || "")) {
    guestCartId = createObjectId();
    localStorage.setItem(GUEST_CART_ID_KEY, guestCartId);
  }

  return guestCartId;
};

export const getCartOwnerId = (user) =>
  user?.id || user?._id || getGuestCartId();
