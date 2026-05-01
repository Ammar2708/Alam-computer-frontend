import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  fetchCartItems,
  updateCartQuantity,
} from "@/store/shop/cart-slice/index";
import { toast } from "sonner";

function CartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth || {});
  const { productList = [] } = useSelector(
    (state) => state.shopProducts || {}
  );

  const dispatch = useDispatch();
  const userId = user?.id || user?._id;

  const handleUpdateQuantity = async (type) => {
    if (!cartItem || !userId) return;

    if (type === "plus") {
      const product = productList.find((p) => p._id === cartItem.productId);
      const stock = product?.totalStock || cartItem?.totalStock;

      if (cartItem.quantity + 1 > stock) {
        toast.error(`Only ${stock} item(s) available`);
        return;
      }
    }

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

  const handleDelete = async () => {
    if (!userId) return;

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

  const price =
    (cartItem.salePrice > 0 ? cartItem.salePrice : cartItem.price) *
    cartItem.quantity;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-white p-3 shadow-sm transition hover:border-red-200 hover:shadow-md sm:gap-4 sm:p-3.5">
      <div
        className={`shrink-0 overflow-hidden rounded-xl border border-gray-100 ${
          cartItem?.usesPopupContent
            ? "h-18 w-18 bg-white"
            : "h-18 w-18 bg-gray-50 p-2"
        }`}
      >
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className={`h-full w-full ${
            cartItem?.usesPopupContent ? "object-cover" : "object-contain"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-red-500">
          Cart Item
        </p>
        <h3 className="mt-1 text-sm font-black text-gray-800 line-clamp-1">
          {cartItem?.title}
        </h3>

        {cartItem?.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
            {cartItem.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full border-red-100 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
            disabled={cartItem.quantity <= 1}
            onClick={() => handleUpdateQuantity("minus")}
          >
            <Minus size={14} />
          </Button>

          <span className="min-w-6 text-center text-sm font-black text-gray-800">
            {cartItem.quantity}
          </span>

          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full border-red-100 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleUpdateQuantity("plus")}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-2">
        <p className="text-sm font-black text-red-600">AED {price}</p>

        <button
          onClick={handleDelete}
          className="rounded-full p-1 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default CartItemsContent;
