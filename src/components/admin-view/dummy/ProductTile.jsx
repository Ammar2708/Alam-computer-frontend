import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Edit3, Trash2, Package, Tag } from "lucide-react";

function AdminProductTile({
  product,
  handleEditProduct,
  handleDelete,
}) {
  const hasSalePrice = Number(product?.salePrice) > 0;
  const displayPrice = hasSalePrice ? product?.salePrice : product?.price;
  const isLowStock = product?.totalStock < 5;
  const productImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : product?.image
      ? [product.image]
      : [];
  const primaryImage = productImages[0];

  return (
    <Card className="group relative mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden rounded-xl border-slate-200 bg-white transition-all duration-500 hover:border-red-500/30 hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.1)] md:w-50">
      {/* Top Action Overlay (Optional - visible on hover for a cleaner look) */}
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {hasSalePrice && (
          <div className="flex items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
            <Tag className="h-3 w-3" />
            SALE
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 p-6">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product?.title}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-slate-400">
            <Package className="h-10 w-10 opacity-20" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm border border-slate-100">
            {product?.category}
          </span>
        </div>
        {productImages.length > 1 ? (
          <div className="absolute bottom-3 right-3 rounded-full border border-slate-100 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 shadow-sm backdrop-blur-sm">
            {productImages.length} Photos
          </div>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-red-600">
            {product?.brand || "Premium Hardware"}
          </p>
          <div className={`flex items-center gap-1.5 text-[11px] font-bold ${isLowStock ? 'text-red-500' : 'text-slate-400'}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${isLowStock ? 'animate-pulse bg-red-500' : 'bg-slate-300'}`} />
            {product?.totalStock} IN STOCK
          </div>
        </div>

        <h2 className="mb-3 line-clamp-2 min-h-[40px] text-base font-bold leading-tight text-slate-900 group-hover:text-red-600 transition-colors">
          {product?.title}
        </h2>

        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
          {product?.description || "High-performance components and professional gear."}
        </p>

        {/* Pricing Section */}
        <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400">Price</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                AED {displayPrice}
              </span>
              {hasSalePrice && (
                <span className="text-sm font-medium text-slate-400 line-through decoration-red-500/50">
                  AED {product?.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-3 p-5 pt-5">
        <Button
          variant="outline"
          className="h-10 gap-2 rounded-lg border-slate-200 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:text-red-600"
          onClick={() => handleEditProduct(product)}
        >
          <Edit3 className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          className="h-10 w-full gap-2 rounded-lg bg-red-600 font-bold text-white transition-all hover:bg-red-700 active:scale-95 md:w-20"
          onClick={() => handleDelete(product?._id)}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AdminProductTile;
