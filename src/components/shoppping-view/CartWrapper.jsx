import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { ShoppingBag } from "lucide-react";
import UserCartItemsContent from "./CartItemsWrapper"; // Ensure this path matches your "CartItemsContent" file

function CartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const items = Array.isArray(cartItems) ? cartItems : cartItems?.items || [];
  const totalCartAmount = items.reduce(
    (sum, item) =>
      sum + (item.salePrice > 0 ? item.salePrice : item.price) * item.quantity,
    0
  );

  return (
    <SheetContent className="w-[92vw] border-l border-red-100 bg-[linear-gradient(180deg,#fff_0%,#fff7f7_30%,#fff_100%)] p-0 sm:max-w-md">
      <SheetHeader className="border-b border-red-100 bg-red-600 px-6 py-5 text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-100">
              Alam Computer
            </p>
            <SheetTitle className="text-lg font-black uppercase text-white">
              Your Cart
            </SheetTitle>
          </div>
        </div>
      </SheetHeader>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-5 sm:px-5">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-red-100 bg-white px-4 py-3 shadow-sm">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
              Items
            </p>
            <p className="mt-1 text-sm font-bold text-gray-800">
              {items.length} product{items.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400">
              Total
            </p>
            <p className="mt-1 text-lg font-black text-red-600">
              AED {totalCartAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <div className="space-y-3">
            {items.length > 0 ? (
              items.map((item) => (
                <UserCartItemsContent
                  key={item.productId || item._id}
                  cartItem={item}
                />
              ))
            ) : (
              <div className="mt-12 rounded-2xl border border-dashed border-red-200 bg-white px-5 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <p className="mt-4 text-base font-black uppercase text-gray-800">
                  Your cart is empty
                </p>
                <p className="mt-2 text-sm font-medium text-gray-500">
                  Add products from the listing and they will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-4 rounded-[24px] border border-red-100 bg-gray-950 p-4 text-white shadow-[0_18px_30px_rgba(15,23,42,0.14)]">
          <div className="flex justify-between text-sm font-black">
            <span className="uppercase tracking-[0.18em] text-gray-300">Total</span>
            <span className="text-lg text-red-400">AED {totalCartAmount.toFixed(2)}</span>
          </div>

          <Button
            disabled={items.length === 0}
            onClick={() => {
              navigate("/shop/checkout");
              setOpenCartSheet?.(false);
            }}
            className="h-12 w-full bg-red-600 text-sm font-black uppercase tracking-[0.18em] text-white shadow-md hover:bg-red-700"
          >
            Proceed To Checkout
          </Button>
        </div>
      </div>
    </SheetContent>
  );
}

export default CartWrapper;


