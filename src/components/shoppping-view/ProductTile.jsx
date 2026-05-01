import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config/index";
import { Badge } from "../ui/badge";
import { Eye, LogIn, ShoppingCart } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddToCart,
  requiresLogin = false,
}) {
  const hasSalePrice = Number(product?.salePrice) > 0;
  const displayPrice = hasSalePrice ? product?.salePrice : product?.price;
  const productImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product?.image
      ? [product.image]
      : [];
  const primaryImage = productImages[0];
  const stockLabel =
    product?.totalStock === 0
      ? { text: "Out of Stock", className: "bg-slate-700 text-white" }
      : product?.totalStock < 10
      ? { text: `${product?.totalStock} Left`, className: "bg-red-600 text-white" }
      : hasSalePrice
      ? { text: "Sale", className: "bg-emerald-600 text-white" }
      : null;

  const handleTileClick = () => {
    if (handleGetProductDetails && product?._id) {
      handleGetProductDetails(product._id);
    }
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    if (handleAddToCart && product?._id) {
      handleAddToCart(product._id);
    }
  };

  return (
    <Card className="group mx-auto flex h-full w-full max-w-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:max-w-[240px]">
      <div
        className="flex flex-1 cursor-pointer flex-col"
        onClick={handleTileClick}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleTileClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#f8fafc_100%)] px-4 pt-4">
          <div className="flex h-[150px] items-center justify-center rounded-[18px] bg-slate-50">
            <img
              src={primaryImage}
              alt={product?.title}
              className="h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {stockLabel ? (
            <Badge
              className={`absolute left-6 top-6 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${stockLabel.className}`}
            >
              {stockLabel.text}
            </Badge>
          ) : null}
          {productImages.length > 1 ? (
            <Badge className="absolute right-6 top-6 rounded-full bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
              {productImages.length} Photos
            </Badge>
          ) : null}
        </div>

        <CardContent className="flex flex-1 flex-col px-4 pb-3 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-red-600">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="line-clamp-1 text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>

          <h2 className="mb-2 min-h-[38px] line-clamp-2 text-[13px] font-black uppercase leading-[1.15] tracking-tight text-slate-900">
            {product?.title}
          </h2>

          <div className="mt-auto rounded-2xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-end justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Price
                </span>
                <span
                  className={`text-lg font-black leading-none ${
                    hasSalePrice ? "text-red-600" : "text-slate-900"
                  }`}
                >
                  AED {displayPrice}
                </span>
              </div>

              {hasSalePrice ? (
                <span className="text-[10px] font-bold text-slate-400 line-through">
                  AED {product?.price}
                </span>
              ) : null}
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex gap-2 px-3 pb-4 pt-0 sm:px-4">
        <Button
          onClick={handleTileClick}
          className="h-10 flex-1 whitespace-nowrap rounded-2xl border-slate-200 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-900 hover:bg-slate-50"
          variant="outline"
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>

        <Button
          onClick={handleAddToCartClick}
          disabled={product?.totalStock === 0}
          title={requiresLogin ? "Login to add this item" : "Add to cart"}
          className={`flex h-10 items-center justify-center rounded-2xl bg-red-600 text-white hover:bg-red-700 ${
            requiresLogin ? "w-auto whitespace-nowrap px-2 text-[11px] font-bold uppercase tracking-[0.12em] min-[360px]:px-3" : "w-10"
          }`}
        >
          {requiresLogin ? (
            <>
              <LogIn className="mr-1 h-4 w-4" />
              Login
            </>
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
