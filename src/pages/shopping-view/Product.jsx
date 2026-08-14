import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Check,
  Headphones,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { fetchProductDetails } from "@/store/shop/product-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getCartOwnerId } from "@/utils/cartOwner";
import PageSeo from "@/components/seo/PageSeo";
import { Button } from "@/components/ui/button";

const siteUrl = (import.meta.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function ShoppingProduct() {
  const { categorySlug, productId, productSlug } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const { productDetails: product, isLoading } = useSelector((state) => state.shopProducts);
  const { user = null } = useSelector((state) => state.auth || {});
  const { cartItems = { items: [] } } = useSelector((state) => state.cart || {});

  useEffect(() => {
    if (!product || product._id !== productId) dispatch(fetchProductDetails(productId));
  }, [dispatch, product, productId]);

  if (!product) {
    return <main className="mx-auto min-h-[50vh] max-w-6xl px-4 py-16"><h1 className="text-3xl font-black">{isLoading ? "Loading product" : "Product not found"}</h1></main>;
  }

  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean);
  const activeImage = images.includes(selectedImage) ? selectedImage : images[0];
  const price = Number(product.salePrice) > 0 ? product.salePrice : product.price;
  const canonical = `${siteUrl}/${categorySlug}/${productId}/${productSlug}`;
  const alt = `${product.title}${product.brand ? ` by ${product.brand}` : ""} - ${product.category}`;
  const isOutOfStock = Number(product.totalStock) <= 0;
  const hasSalePrice = Number(product.salePrice) > 0;

  const handleAddToCart = async () => {
    const currentQuantity = cartItems.items?.find((item) => item.productId === product._id)?.quantity || 0;
    const availableStock = Number(product.totalStock) || 0;

    if (currentQuantity + 1 > availableStock) {
      toast.error(`Only ${availableStock} item(s) available in stock`);
      return;
    }

    setIsAdding(true);
    const userId = getCartOwnerId(user);
    const result = await dispatch(addToCart({ userId, productId: product._id, quantity: 1 }));

    if (result?.payload?.success) {
      await dispatch(fetchCartItems(userId));
      toast.success("Item added to cart");
    } else {
      toast.error(result?.payload?.message || "Failed to add item to cart");
    }
    setIsAdding(false);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <PageSeo title={product.title} description={product.description || `Buy ${product.title} from Alam Computer.`} canonical={canonical} image={images[0]} type="product" />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <Link className="hover:text-red-600" to="/">Home</Link> / <Link className="hover:text-red-600" to={`/${categorySlug}`}>{product.category}</Link> / <span>{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <section aria-label={`${product.title} images`}>
          {activeImage ? <img src={activeImage} alt={alt} className="aspect-square w-full rounded-3xl border border-slate-100 bg-slate-50 object-contain p-8 shadow-sm" fetchPriority="high" decoding="async" width="800" height="800" /> : null}
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((src, index) => (
                <button key={src} type="button" onClick={() => setSelectedImage(src)} className={`overflow-hidden rounded-xl border-2 bg-slate-50 transition hover:border-red-300 ${src === activeImage ? "border-red-600 ring-2 ring-red-100" : "border-transparent"}`} aria-label={`Show ${product.title} image ${index + 1}`} aria-pressed={src === activeImage}>
                  <img src={src} alt={`${alt}, view ${index + 1}`} className="aspect-square w-full object-contain p-2" loading="lazy" decoding="async" width="240" height="240" />
                </button>
              ))}
            </div>
          ) : null}
        </section>

        <article className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">{product.brand} · {product.category}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${isOutOfStock ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>{isOutOfStock ? "Out of stock" : "In stock"}</span>
          </div>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{product.title}</h1>
          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-black text-red-600">AED {price}</p>
            {hasSalePrice ? <p className="pb-1 text-base font-semibold text-slate-400 line-through">AED {product.price}</p> : null}
          </div>

          <div className="mt-7 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-5">
            <Button type="button" onClick={handleAddToCart} disabled={isOutOfStock || isAdding} className="h-14 w-full rounded-2xl bg-red-600 text-base font-black text-white shadow-lg shadow-red-200 hover:bg-red-700">
              {isAdding ? <PackageCheck className="mr-2 h-5 w-5 animate-pulse" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
              {isOutOfStock ? "Currently unavailable" : isAdding ? "Adding to cart..." : "Add to cart"}
            </Button>
            <Button asChild variant="outline" className="mt-3 h-14 w-full rounded-2xl border-slate-300 text-base font-black text-slate-900 hover:border-red-300 hover:bg-red-50 hover:text-red-700">
              <Link to="/contact"><Headphones className="mr-2 h-5 w-5" />Contact us about this product</Link>
            </Button>
            <p className="mt-3 text-center text-xs font-medium text-slate-500">Need help choosing? Our product team is happy to assist.</p>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
            <div className="rounded-2xl bg-slate-50 p-3"><Truck className="mx-auto mb-2 h-5 w-5 text-red-600" />UAE delivery</div>
            <div className="rounded-2xl bg-slate-50 p-3"><ShieldCheck className="mx-auto mb-2 h-5 w-5 text-red-600" />Secure order</div>
            <div className="rounded-2xl bg-slate-50 p-3"><Check className="mx-auto mb-2 h-5 w-5 text-red-600" />Stock checked</div>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-black">Product description</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{product.description || `Explore ${product.title}, available from Alam Computer in the UAE.`}</p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-black">Product details</h2>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
              <dt className="text-slate-500">Brand</dt><dd className="text-right font-bold text-slate-900">{product.brand || "Alam Computer"}</dd>
              <dt className="text-slate-500">Category</dt><dd className="text-right font-bold text-slate-900">{product.category}</dd>
              <dt className="text-slate-500">Availability</dt><dd className="text-right font-bold text-slate-900">{product.totalStock > 0 ? `In stock (${product.totalStock})` : "Out of stock"}</dd>
              <dt className="text-slate-500">SKU</dt><dd className="truncate text-right font-mono text-xs text-slate-700" title={product._id}>{product._id}</dd>
            </dl>
          </section>
        </article>
      </div>
    </main>
  );
}
