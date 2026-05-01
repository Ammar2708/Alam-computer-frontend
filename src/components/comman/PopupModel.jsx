import { ArrowRight, Megaphone, X } from "lucide-react";

function PopupModal({
  popup,
  product,
  onClose,
  onShopNow,
  isAddingToCart = false,
}) {
  const hasSalePrice = Number(product?.salePrice) > 0;
  const displayPrice = hasSalePrice ? product?.salePrice : product?.price;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/60 bg-white shadow-[0_35px_120px_rgba(15,23,42,0.35)]">
        <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top_right,_rgba(239,68,68,0.22),_transparent_58%),linear-gradient(90deg,rgba(248,250,252,0.95),rgba(255,255,255,0.6))]" />

        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-500 transition hover:border-red-200 hover:text-red-600"
          aria-label="Close popup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-[1.08fr_0.92fr]">
          <div className="relative bg-[linear-gradient(180deg,#fef2f2_0%,#fff7ed_100%)] p-5 md:p-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-red-600">
              <Megaphone className="h-3.5 w-3.5" />
              Featured Offer
            </div>

            <div className="overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(239,68,68,0.14)]">
              {popup.imageUrl ? (
                <img
                  src={popup.imageUrl}
                  alt={popup.title}
                  className="h-[240px] w-full object-cover md:h-[420px]"
                />
              ) : (
                <div className="flex h-[240px] items-center justify-center bg-[linear-gradient(135deg,#fee2e2,#fff7ed)] text-sm font-semibold uppercase tracking-[0.24em] text-red-500 md:h-[420px]">
                  Special Promotion
                </div>
              )}
            </div>
          </div>

          <div className="relative flex flex-col justify-center p-6 md:p-8">
            <div className="mb-4 h-1.5 w-16 rounded-full bg-red-500" />

            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400">
              Limited Time
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 md:text-4xl">
              {popup.title}
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 md:text-[15px]">
              {popup.description}
            </p>

            {typeof displayPrice === "number" && (
              <div className="mt-6 flex items-end gap-3">
                <p className="text-3xl font-black text-red-600">
                  AED {displayPrice}
                </p>

                {hasSalePrice && (
                  <p className="pb-1 text-sm font-bold text-slate-400 line-through">
                    AED {product?.price}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onShopNow}
                disabled={isAddingToCart}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isAddingToCart ? "Adding..." : "Shop Now"}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupModal;
