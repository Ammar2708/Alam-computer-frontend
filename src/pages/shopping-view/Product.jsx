import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProductDetails } from "@/store/shop/product-slice";
import PageSeo from "@/components/seo/PageSeo";

const siteUrl = (import.meta.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export default function ShoppingProduct() {
  const { categorySlug, productId, productSlug } = useParams();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState("");
  const { productDetails: product, isLoading } = useSelector((state) => state.shopProducts);

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
  const alt = `${product.title}${product.brand ? ` by ${product.brand}` : ""} – ${product.category}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      <PageSeo title={product.title} description={product.description || `Buy ${product.title} from Alam Computer.`} canonical={canonical} image={images[0]} type="product" />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <Link to="/">Home</Link> / <Link to={`/${categorySlug}`}>{product.category}</Link> / <span>{product.title}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <section aria-label={`${product.title} images`}>
          {activeImage ? <img src={activeImage} alt={alt} className="aspect-square w-full rounded-3xl bg-slate-50 object-contain p-8" fetchPriority="high" decoding="async" width="800" height="800" /> : null}
          {images.length > 1 ? (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setSelectedImage(src)}
                  className={`overflow-hidden rounded-xl border-2 bg-slate-50 transition hover:border-red-300 ${
                    src === activeImage
                      ? "border-red-600 ring-2 ring-red-100"
                      : "border-transparent"
                  }`}
                  aria-label={`Show ${product.title} image ${index + 1}`}
                  aria-pressed={src === activeImage}
                >
                  <img
                    src={src}
                    alt={`${alt}, view ${index + 1}`}
                    className="aspect-square w-full object-contain p-2"
                    loading="lazy"
                    decoding="async"
                    width="240"
                    height="240"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </section>
        <article>
          <p className="text-sm font-bold uppercase tracking-widest text-red-600">{product.brand} · {product.category}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{product.title}</h1>
          <p className="mt-5 text-3xl font-black text-red-600">AED {price}</p>
          <section className="mt-8">
            <h2 className="text-xl font-black">Product description</h2>
            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">{product.description || `Explore ${product.title}, available from Alam Computer in the UAE.`}</p>
          </section>
          <section className="mt-8">
            <h2 className="text-xl font-black">Product details</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-5 text-sm"><dt>Brand</dt><dd>{product.brand || "Alam Computer"}</dd><dt>Category</dt><dd>{product.category}</dd><dt>Availability</dt><dd>{product.totalStock > 0 ? `In stock (${product.totalStock})` : "Out of stock"}</dd><dt>SKU</dt><dd>{product._id}</dd></dl>
          </section>
        </article>
      </div>
    </main>
  );
}
