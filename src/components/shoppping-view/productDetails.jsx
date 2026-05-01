import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  LogIn,
  ShoppingCart,
} from "lucide-react";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddToCart,
  requiresLogin = false,
}) {
  const [selectedImageState, setSelectedImageState] = useState({
    productId: null,
    index: 0,
  });
  const productImages = useMemo(() => {
    if (!productDetails) return [];

    if (Array.isArray(productDetails?.images) && productDetails.images.length > 0) {
      return productDetails.images.filter(Boolean);
    }

    return productDetails?.image ? [productDetails.image] : [];
  }, [productDetails]);

  if (!productDetails) return null;

  const isOutOfStock = productDetails?.totalStock === 0;
  const hasSalePrice = productDetails?.salePrice && productDetails?.salePrice > 0;
  const currentProductId = productDetails?._id || null;
  const selectedImageIndex =
    selectedImageState.productId === currentProductId
      ? Math.min(selectedImageState.index, Math.max(productImages.length - 1, 0))
      : 0;
  const activeImage = productImages[selectedImageIndex] || productImages[0];
  const canBrowseImages = productImages.length > 1;

  const onAddToCartClick = () => {
    if (handleAddToCart && productDetails?._id) {
      handleAddToCart(productDetails._id);
    }
  };

  const goToPreviousImage = () => {
    setSelectedImageState({
      productId: currentProductId,
      index: selectedImageIndex === 0 ? productImages.length - 1 : selectedImageIndex - 1,
    });
  };

  const goToNextImage = () => {
    setSelectedImageState({
      productId: currentProductId,
      index: selectedImageIndex === productImages.length - 1 ? 0 : selectedImageIndex + 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid max-h-[90vh] max-w-[calc(100vw-2rem)] grid-cols-1 gap-5 overflow-y-auto rounded-2xl bg-white p-4 outline-none sm:max-w-[92vw] sm:p-6 lg:max-w-[980px] lg:grid-cols-[1.05fr_0.95fr] lg:gap-7">
        <div className="min-w-0 space-y-3">
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:min-h-[420px]">
            {activeImage ? (
              <img
                src={activeImage}
                alt={productDetails?.title}
                className="max-h-[260px] w-full object-contain transition-transform duration-300 hover:scale-105 sm:max-h-[390px]"
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-slate-400">
                <ImageIcon className="h-12 w-12" />
                <span className="text-sm font-semibold">No image available</span>
              </div>
            )}

            {canBrowseImages ? (
              <>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute left-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 text-slate-900 shadow-md hover:bg-white"
                  onClick={goToPreviousImage}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Previous image</span>
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-3 top-1/2 h-9 w-9 -translate-y-1/2 rounded-full bg-white/90 text-slate-900 shadow-md hover:bg-white"
                  onClick={goToNextImage}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">Next image</span>
                </Button>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm">
                  {selectedImageIndex + 1} / {productImages.length}
                </span>
              </>
            ) : null}
          </div>

          {canBrowseImages ? (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {productImages.map((imageUrl, index) => (
                <button
                  key={`${imageUrl}-${index}`}
                  type="button"
                  onClick={() =>
                    setSelectedImageState({
                      productId: currentProductId,
                      index,
                    })
                  }
                  className={`aspect-square overflow-hidden rounded-xl border bg-slate-50 p-1 transition ${
                    selectedImageIndex === index
                      ? "border-red-600 ring-2 ring-red-100"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={`${productDetails?.title} view ${index + 1}`}
                    className="h-full w-full rounded-lg object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col">
          <div>
            <h1 className="text-2xl font-black leading-tight text-gray-900">
              {productDetails?.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                {productDetails?.category}
              </span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {productDetails?.brand}
              </span>
            </div>
          </div>

          <p className="mt-4 max-h-[130px] overflow-y-auto leading-relaxed text-gray-600">
            {productDetails?.description}
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            {hasSalePrice ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  AED {productDetails?.salePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  AED {productDetails?.price}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                AED {productDetails?.price}
              </span>
            )}
          </div>

          <div className="mt-2 text-sm">
            {isOutOfStock ? (
              <span className="font-medium italic text-red-500">
                Currently Sold Out
              </span>
            ) : (
              <span className="font-medium text-green-600">
                In Stock ({productDetails?.totalStock} units left)
              </span>
            )}
          </div>

          <div className="mt-auto pt-6">
            <Button
              onClick={onAddToCartClick}
              disabled={isOutOfStock}
              className={`h-12 w-full text-lg font-bold transition-all ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-500"
                  : "bg-black text-white shadow-lg hover:bg-gray-800"
              }`}
            >
              {requiresLogin && !isOutOfStock ? (
                <LogIn className="mr-2 h-5 w-5" />
              ) : (
                <ShoppingCart className="mr-2 h-5 w-5" />
              )}
              {isOutOfStock
                ? "Out of Stock"
                : requiresLogin
                ? "Login to Add to Cart"
                : "Add to Cart"}
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="mb-2">
            <h2 className="mb-3 text-lg font-bold text-gray-900">
              Customer Reviews
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm font-semibold text-gray-800">5.0 - Ali</p>
                <p className="text-xs text-gray-600">
                  Great quality, exactly as described.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
