import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/store/order-slice";
import { fetchCheckoutSettings } from "@/store/settings-slice";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQuantity,
} from "@/store/shop/cart-slice";

const initialOrderFormData = {
  customerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  notes: "",
};

const getItemUnitPrice = (item) =>
  item?.salePrice > 0 ? item.salePrice : item?.price || 0;

const formatCurrency = (amount) => `AED ${amount.toFixed(2)}`;

const ShoppingCheckout = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems, isLoading } = useSelector((state) => state.cart);
  const { loading: orderLoading } = useSelector((state) => state.orders);
  const { checkoutSettings } = useSelector((state) => state.checkoutSettings || {});
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState(initialOrderFormData);

  const userId = user?.id || user?._id;
  const items = cartItems?.items || [];
  const isOrderFormComplete =
    orderFormData.customerName.trim() &&
    orderFormData.email.trim() &&
    orderFormData.phone.trim() &&
    orderFormData.address.trim() &&
    orderFormData.city.trim() &&
    orderFormData.postalCode.trim();

  const totalItems = items.reduce((sum, item) => sum + (item?.quantity || 0), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + getItemUnitPrice(item) * (item?.quantity || 0),
    0
  );
  const deliveryCharge = Math.max(
    0,
    Number(checkoutSettings?.deliveryCharge) || 0
  );
  const totalAmount = subtotal + deliveryCharge;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartItems(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(fetchCheckoutSettings());
  }, [dispatch]);

  useEffect(() => {
    setOrderFormData((prev) => ({
      ...prev,
      customerName: prev.customerName || user?.username || user?.name || "",
      email: prev.email || user?.email || "",
    }));
  }, [user]);

  const handleUpdateQuantity = async (cartItem, type) => {
    if (!cartItem || !userId) return;

    const newQty = type === "plus" ? cartItem.quantity + 1 : cartItem.quantity - 1;

    const res = await dispatch(
      updateCartQuantity({
        userId,
        productId: cartItem.productId,
        quantity: newQty,
      })
    );

    if (res?.payload?.success) {
      await dispatch(fetchCartItems(userId));
      toast.success("Cart updated");
      return;
    }

    toast.error(res?.payload?.message || "Failed to update cart");
  };

  const handleDelete = async (cartItem) => {
    if (!cartItem || !userId) return;

    const res = await dispatch(
      deleteCartItem({
        userId,
        productId: cartItem.productId,
      })
    );

    if (res?.payload?.success) {
      await dispatch(fetchCartItems(userId));
      toast.success("Item removed");
      return;
    }

    toast.error(res?.payload?.message || "Failed to remove item");
  };

  const handleOpenOrderDialog = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setOrderDialogOpen(true);
  };

  const handleOrderInputChange = (event) => {
    const { name, value } = event.target;

    setOrderFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (!isOrderFormComplete) {
      toast.error("Please complete all required delivery details");
      return;
    }

    const res = await dispatch(
      createOrder({
        userId,
        customerName: orderFormData.customerName.trim(),
        email: orderFormData.email.trim(),
        phone: orderFormData.phone.trim(),
        address: orderFormData.address.trim(),
        city: orderFormData.city.trim(),
        postalCode: orderFormData.postalCode.trim(),
        notes: orderFormData.notes.trim(),
        paymentMethod: "cash_on_delivery",
      })
    );

    if (res?.payload?.success) {
      toast.success(res.payload.message || "Order placed successfully");
      setOrderDialogOpen(false);
      setOrderFormData({
        ...initialOrderFormData,
        customerName: user?.username || user?.name || "",
        email: user?.email || "",
      });
      await dispatch(fetchCartItems(userId));
      return;
    }

    toast.error(res?.payload?.message || "Failed to place order");
  };

  if (!userId) {
    return (
      <section className="min-h-[70vh] bg-gradient-to-b from-red-600 via-red-600 to-red-50 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-red-100 bg-white p-5 text-center shadow-[0_20px_60px_rgba(153,27,27,0.18)] sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-3xl font-black uppercase tracking-tight text-gray-900">
            Checkout
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-500">
            Please log in first to view the items in your cart.
          </p>
          <Button asChild className="mt-6 bg-red-600 font-black uppercase hover:bg-red-700">
            <Link to="/auth/login">Go To Login</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[70vh] bg-gradient-to-b from-red-600 via-red-600 to-red-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl min-w-0">
        <div className="overflow-hidden rounded-[24px] border border-red-100 bg-white shadow-[0_24px_70px_rgba(153,27,27,0.20)] md:rounded-[32px]">
          <div className="bg-red-600 px-6 py-8 text-white md:px-10">
            <Link
              to="/shop/listing"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-red-100 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>

            <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-red-100">
                  Alam Computer
                </p>
                <h1 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Checkout
                </h1>
                <p className="mt-3 max-w-2xl text-sm font-medium text-red-50">
                  Review your order, verify quantities, and place everything with the
                  same clean red-and-white shopping experience as the rest of your site.
                </p>
              </div>

              <div className="rounded-2xl border border-red-400 bg-red-700/50 px-5 py-4 backdrop-blur">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-100">
                  Items In Cart
                </p>
                <p className="mt-1 text-3xl font-black">{totalItems}</p>
              </div>
            </div>
          </div>

          {!isLoading && items.length === 0 ? (
            <div className="px-6 py-14 text-center md:px-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <h2 className="mt-6 text-2xl font-black uppercase text-gray-900">
                Your Cart Is Empty
              </h2>
              <p className="mt-3 text-sm font-medium text-gray-500">
                Add some products to your cart and they will appear here at checkout.
              </p>
              <Button
                asChild
                className="mt-6 bg-red-600 font-black uppercase hover:bg-red-700"
              >
                <Link to="/shop/listing">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 px-4 py-6 sm:px-6 md:px-10 md:py-8 lg:grid-cols-[1.7fr_0.9fr]">
              <div className="rounded-[26px] border border-red-100 bg-gradient-to-br from-white to-red-50 p-4 sm:p-6">
                <div className="flex items-center justify-between border-b border-red-100 pb-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                      Order Review
                    </p>
                    <h2 className="mt-1 text-xl font-black uppercase text-gray-900">
                      Cart Items
                    </h2>
                  </div>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase text-red-600">
                    {totalItems} item{totalItems === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div
                        className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl ${
                          item?.usesPopupContent ? "bg-white" : "bg-red-50 p-3"
                        }`}
                      >
                        <img
                          src={item?.image}
                          alt={item?.title}
                          className={`h-full w-full ${
                            item?.usesPopupContent ? "object-cover" : "object-contain"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-black uppercase text-gray-900">
                          {item?.title}
                        </h3>

                        {item?.description && (
                          <p className="mt-1 max-w-xl text-sm text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold uppercase">
                          <span className="rounded-full bg-red-100 px-3 py-1 text-red-600">
                            Unit: {formatCurrency(getItemUnitPrice(item))}
                          </span>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-2 py-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full border-red-100 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                              disabled={item.quantity <= 1}
                              onClick={() => handleUpdateQuantity(item, "minus")}
                            >
                              <Minus size={14} />
                            </Button>

                            <span className="min-w-6 text-center text-sm font-black text-gray-800">
                              {item.quantity}
                            </span>

                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 rounded-full border-red-100 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleUpdateQuantity(item, "plus")}
                            >
                              <Plus size={14} />
                            </Button>
                          </div>

                          <button
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>

                      <p className="self-start text-lg font-black text-red-600 sm:self-center">
                        {formatCurrency(getItemUnitPrice(item) * item?.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[26px] border border-red-100 bg-gray-950 p-6 text-white shadow-[0_18px_40px_rgba(17,24,39,0.22)]">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-300">
                  Payment Summary
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase">Order Summary</h2>

                <div className="mt-6 space-y-3 border-b border-white/10 pb-5 text-sm font-medium">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Items</span>
                    <span className="font-black text-white">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="font-black text-white">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Shipping</span>
                    <span
                      className={`font-black ${
                        deliveryCharge > 0 ? "text-white" : "text-emerald-300"
                      }`}
                    >
                      {deliveryCharge > 0 ? formatCurrency(deliveryCharge) : "Free"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-[0.18em] text-gray-300">
                    Total
                  </span>
                  <span className="text-2xl font-black text-red-400">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-sm font-black uppercase">Secure Checkout</p>
                        <p className="text-xs text-gray-400">
                          Your order summary is ready for final confirmation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <Truck className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-sm font-black uppercase">Fast Delivery</p>
                        <p className="text-xs text-gray-400">
                          Delivery is prepared after order confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleOpenOrderDialog}
                  className="mt-6 w-full bg-red-600 font-black uppercase text-white hover:bg-red-700"
                  disabled={items.length === 0}
                >
                  Place Order
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="mt-3 w-full border-red-300 bg-transparent font-black uppercase text-red-100 hover:bg-red-600 hover:text-white"
                >
                  <Link to="/shop/listing">Add More Products</Link>
                </Button>
              </aside>
            </div>
          )}
        </div>
      </div>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-0 bg-white p-0 shadow-[0_24px_70px_rgba(153,27,27,0.25)] sm:max-w-2xl">
          <div className="bg-red-600 px-5 py-6 text-white sm:px-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <DialogHeader className="mt-4 text-left">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-white">
                Complete Order
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-red-50">
                Add delivery details and confirm your cash on delivery order.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-5 px-5 py-6 sm:px-7">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  <UserRound className="h-4 w-4 text-red-600" />
                  Name
                </span>
                <Input
                  name="customerName"
                  value={orderFormData.customerName}
                  onChange={handleOrderInputChange}
                  placeholder="Customer name"
                  className="h-11 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  <Phone className="h-4 w-4 text-red-600" />
                  Phone
                </span>
                <Input
                  name="phone"
                  type="tel"
                  value={orderFormData.phone}
                  onChange={handleOrderInputChange}
                  placeholder="Phone number"
                  className="h-11 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                  required
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  Email
                </span>
                <Input
                  name="email"
                  type="email"
                  value={orderFormData.email}
                  onChange={handleOrderInputChange}
                  placeholder="Email address"
                  className="h-11 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                  required
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  <MapPin className="h-4 w-4 text-red-600" />
                  Address
                </span>
                <Textarea
                  name="address"
                  value={orderFormData.address}
                  onChange={handleOrderInputChange}
                  placeholder="Full delivery address"
                  className="min-h-24 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  City
                </span>
                <Input
                  name="city"
                  value={orderFormData.city}
                  onChange={handleOrderInputChange}
                  placeholder="City"
                  className="h-11 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                  required
                />
              </label>

              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  Postal Code
                </span>
                <Input
                  name="postalCode"
                  value={orderFormData.postalCode}
                  onChange={handleOrderInputChange}
                  placeholder="Postal code"
                  className="h-11 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                  required
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">
                  Notes
                </span>
                <Textarea
                  name="notes"
                  value={orderFormData.notes}
                  onChange={handleOrderInputChange}
                  placeholder="Optional delivery notes"
                  className="min-h-20 rounded-xl border-red-100 bg-red-50/40 focus-visible:border-red-300 focus-visible:ring-red-100"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-gray-600">Payment</span>
                <span className="font-black text-gray-950">Cash On Delivery</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-gray-600">Subtotal</span>
                <span className="font-black text-gray-950">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-gray-600">Delivery</span>
                <span className="font-black text-gray-950">
                  {deliveryCharge > 0 ? formatCurrency(deliveryCharge) : "Free"}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="font-bold text-gray-600">Total</span>
                <span className="text-xl font-black text-red-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOrderDialogOpen(false)}
                className="h-11 flex-1 rounded-xl border-red-200 font-black uppercase text-red-600 hover:bg-red-50"
                disabled={orderLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="h-11 flex-1 rounded-xl bg-red-600 font-black uppercase text-white hover:bg-red-700"
                disabled={orderLoading || !isOrderFormComplete}
              >
                {orderLoading ? "Placing Order..." : "Confirm Order"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ShoppingCheckout;
