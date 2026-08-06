import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Laptop,
  Monitor,
  Printer,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  resetProductDetails,
} from "@/store/shop/product-slice";
import { getApiUrl } from "@/config/api";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ShoppingProductTile from "@/components/shoppping-view/ProductTile";
import ProductDetailsDialog from "@/components/shoppping-view/productDetails";
import PopupModal from "@/components/comman/PopupModel";
import { getCartOwnerId } from "@/utils/cartOwner";
import PageSeo from "@/components/seo/PageSeo";
import { externalLinkProps, storeContact } from "@/config/contact";

const DISMISSED_POPUP_ID_KEY = "homepage-dismissed-popup-id";
const FEATURED_PRODUCT_CATEGORIES = ["Laptop", "Printer", "All In One", "Ink"];

const brands = [
  "/img4.png",
  "/epson-logo.svg",
  "/img7.png",
  "/img9.png",
  "/img6.png",
  "/img11.png",
  "/img8.png",
  "/img10.png",
  "/img5.png",
];

const featuredCategoryCards = [
  {
    title: "Laptop",
    category: "Laptop",
    description: "Business, student, and everyday laptops ready to shop.",
    Icon: Laptop,
  },
  {
    title: "Printer",
    category: "Printer",
    description: "Office and home printers from trusted brands.",
    Icon: Printer,
  },
  {
    title: "All In One",
    category: "All In One",
    description: "Complete all-in-one systems for compact workspaces.",
    Icon: Monitor,
  },
];

const HERO_SLIDE_DELAY = 6500;
const HERO_SLIDE_TRANSITION_MS = 1100;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const siteUrl = (import.meta.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const storeStructuredData = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: "Alam Computer",
    alternateName: "Intidhar Alam Computer",
    image: `${siteUrl}/logo1.webp`,
    url: siteUrl,
    telephone: "+971557112599",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Industrial Area 3",
      addressLocality: "Sharjah",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.316147,
      longitude: 55.415842,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "21:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.3,
      reviewCount: 77,
    },
  };

  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroSlides, setHeroSlides] = useState([]);

  const [popup, setPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCartLoading, setPopupCartLoading] = useState(false);

  const { productList = [], productDetails = null, isLoading } = useSelector(
    (state) => state.shopProducts || {}
  );
  const { user = null } = useSelector((state) => state.auth || {});
  const { cartItems = { items: [] } } = useSelector(
    (state) => state.cart || {}
  );
  const featuredProducts = useMemo(
    () =>
      FEATURED_PRODUCT_CATEGORIES.map((category) =>
        productList.find(
          (product) =>
            product?.category?.trim().toLowerCase() === category.toLowerCase()
        )
      ).filter(Boolean),
    [productList]
  );

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({}));
  }, [dispatch]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch(getApiUrl("/api/slider"));
        const data = await res.json();

        if (data?.success) {
          setHeroSlides(data.data || []);
        }
      } catch (error) {
        console.log("Slider fetch error:", error);
      }
    };

    fetchSliders();
  }, []);

  useEffect(() => {
    if (productDetails) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [productDetails]);

  useEffect(() => {
    return () => {
      dispatch(resetProductDetails());
    };
  }, [dispatch]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;

    const slideTimer = window.setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, HERO_SLIDE_DELAY);

    return () => window.clearTimeout(slideTimer);
  }, [currentSlide, heroSlides.length]);

  useEffect(() => {
    let popupTimer;
    let isMounted = true;

    const fetchPopup = async () => {
      try {
        const res = await fetch(getApiUrl("/api/latest-popup"));
        const data = await res.json();

        if (!isMounted) return;

        if (!data) {
          setPopup(null);
          setShowPopup(false);
          return;
        }

        if (
          data._id &&
          window.localStorage.getItem(DISMISSED_POPUP_ID_KEY) === data._id
        ) {
          setPopup(data);
          setShowPopup(false);
          return;
        }

        setPopup(data);

        popupTimer = window.setTimeout(() => {
          if (isMounted) {
            setShowPopup(true);
          }
        }, 1200);
      } catch (error) {
        console.log("Popup fetch error:", error);
      }
    };

    fetchPopup();

    return () => {
      isMounted = false;

      if (popupTimer) {
        window.clearTimeout(popupTimer);
      }
    };
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDismissPopup = () => {
    if (popup?._id) {
      window.localStorage.setItem(DISMISSED_POPUP_ID_KEY, popup._id);
    }
    setShowPopup(false);
  };

  const popupProduct =
    (popup?.productId && typeof popup.productId === "object"
      ? popup.productId
      : null) ||
    productList?.find((product) => product._id === popup?.productId) ||
    null;

  const addProductToCartForUser = async (
    productId,
    loggedInUser = user,
    source = "product"
  ) => {
    const activeUserId = getCartOwnerId(loggedInUser);

    const currentProduct =
      source === "popup"
        ? popupProduct ||
          productList?.find((product) => product._id === productId)
        : productList?.find((product) => product._id === productId) ||
          productDetails;

    if (!currentProduct && source !== "popup") {
      toast.error("Product not found");
      return;
    }

    const currentCartItem = cartItems?.items?.find(
      (item) => item.productId === productId
    );

    const currentQuantity = currentCartItem?.quantity || 0;
    const availableStock = currentProduct?.totalStock;

    if (
      typeof availableStock === "number" &&
      currentQuantity + 1 > availableStock
    ) {
      toast.error(`Only ${availableStock} item(s) available in stock`);
      return;
    }

    const cartPayload = {
      userId: activeUserId,
      productId,
      quantity: 1,
    };

    if (source === "popup") {
      cartPayload.popupSnapshot = {
        title: popup?.title,
        description: popup?.description,
        imageUrl: popup?.imageUrl,
      };
    }

    const result = await dispatch(addToCart(cartPayload));

    if (result?.payload?.success) {
      await dispatch(fetchCartItems(activeUserId));
      toast.success("Item added to cart");

      if (source === "popup") {
        setShowPopup(false);
      }

      return;
    }

    toast.error(result?.payload?.message || "Failed to add item to cart");
  };

  const handlePopupShopNow = async () => {
    const popupProductId = popup?.productId?._id || popup?.productId;

    if (!popupProductId) {
      toast.error("No product is attached to this popup.");
      return;
    }

    try {
      setPopupCartLoading(true);
      await addProductToCartForUser(popupProductId, user, "popup");
    } finally {
      setPopupCartLoading(false);
    }
  };

  const handleGetProductDetails = (productId) => {
    if (!productId) return;
    dispatch(fetchProductDetails(productId));
  };

  const handleCloseDialog = () => {
    setOpen(false);
    dispatch(resetProductDetails());
  };

  const handleAddToCart = (currentProductId) => {
    addProductToCartForUser(currentProductId, user);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleFeaturedCategoryClick = (category) => {
    navigate(`/shop/listing?category=${encodeURIComponent(category)}`);
  };

  const showPrevSlide = () => {
    if (!heroSlides.length) return;
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const showNextSlide = () => {
    if (!heroSlides.length) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="w-full">
      <PageSeo title="Alam Computer – Computer Sales, Repair & Spare Parts in Sharjah, UAE" description="Alam Computer in Sharjah offers computer & printer sales, repair, and spare parts. Trusted locally for 15+ years. Visit us in Industrial Area 3, Sharjah, or call +971-5-57112599." canonical={`${siteUrl}/`} image={`${siteUrl}/logo1.webp`} structuredData={storeStructuredData} />
      <section className="mt-3 px-3 sm:px-4 md:mt-4 md:px-16">
        <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_85%_5%,_rgba(239,68,68,0.28),_transparent_28%),linear-gradient(155deg,#270909_0%,#120606_60%,#310b0b_100%)] shadow-[0_18px_45px_rgba(15,23,42,0.22)] md:rounded-[28px] md:bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_32%),linear-gradient(135deg,#190707,#2a0d0d_48%,#faf5f5_48.2%,#fff_100%)]">
          {heroSlides.length > 0 ? (
            <>
              <div
                className="flex transition-transform"
                style={{
                  transform: `translate3d(-${currentSlide * 100}%, 0, 0)`,
                  transitionDuration: `${HERO_SLIDE_TRANSITION_MS}ms`,
                  transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide._id || index}
                    className="grid min-w-full gap-5 px-5 pb-20 pt-6 md:min-h-[360px] md:grid-cols-[1.05fr_0.95fr] md:gap-6 md:px-8 md:py-7"
                  >
                    <div className="flex flex-col justify-between text-white">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full border border-red-400/30 bg-red-500/15 px-4 py-1 text-[11px] font-black uppercase tracking-[0.28em] text-red-200">
                            {slide.eyebrow}
                          </span>
                          <span className="rounded-full bg-white/10 px-4 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-white/80">
                            {slide.accent}
                          </span>
                        </div>

                        <h2 className="mt-4 max-w-2xl text-[1.65rem] font-black uppercase leading-[1.02] tracking-[-0.03em] md:text-4xl">
                          {slide.title}
                        </h2>

                        <p className="mt-3 max-w-xl text-sm font-medium leading-5 text-white/75 md:text-sm">
                          {slide.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {(slide.highlights || []).map((item, idx) => (
                            <span
                              key={idx}
                              className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-white/85 backdrop-blur"
                            >
                              {item}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              navigate(slide.buttonLink || "/shop/listing")
                            }
                            className="rounded-full bg-red-600 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-red-700"
                          >
                            {slide.buttonText || "Shop Now"}
                          </button>
                          <button
                            onClick={() => navigate("/shop/contact")}
                            className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.22em] text-white transition hover:bg-white hover:text-red-600"
                          >
                            Contact Us
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur md:p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                              Genuine
                            </span>
                          </div>
                          <p className="mt-2 hidden text-xs font-bold text-white/90 md:block">
                            Trusted products with solid support.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur md:p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <Truck className="h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                              Fast
                            </span>
                          </div>
                          <p className="mt-2 hidden text-xs font-bold text-white/90 md:block">
                            Quick processing and delivery support.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/8 p-3 backdrop-blur md:p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <Zap className="h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                              Ready
                            </span>
                          </div>
                          <p className="mt-2 hidden text-xs font-bold text-white/90 md:block">
                            Fast route from browsing to checkout.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center px-1 md:px-0">
                      <div className="absolute right-2 top-2 hidden h-24 w-24 rounded-full bg-red-500/20 blur-3xl md:block" />
                      <div className="absolute bottom-4 left-0 hidden h-20 w-20 rounded-full bg-black/10 blur-2xl md:block" />

                      <div className="relative w-full max-w-[430px]">
                        <div className="absolute right-2 top-3 z-10 max-w-[52%] rounded-[18px] border border-red-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur md:-right-4 md:top-4 md:max-w-none md:rounded-[20px] md:px-4 md:py-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                            {slide.statLabel}
                          </p>
                          <p className="mt-1 truncate text-xl font-black text-gray-900 md:text-2xl">
                            {slide.statValue}
                          </p>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-red-100 bg-white p-3 shadow-[0_20px_30px_rgba(239,68,68,0.10)]">
                          <div className="rounded-[18px] bg-[linear-gradient(135deg,#fff_0%,#fff5f5_50%,#fee2e2_100%)] p-3">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="h-[210px] w-full rounded-[16px] object-contain md:h-[245px] md:object-cover"
                            />
                          </div>
                        </div>

                        <div className="absolute -bottom-2 left-3 rounded-2xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg">
                          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Store Focus
                          </p>
                          <p className="mt-1 text-xs font-black uppercase text-red-600">
                            {slide.highlights?.[0] || "Featured"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={showPrevSlide}
                aria-label="Previous slide"
                className="absolute left-2 top-[57%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/95 text-red-600 shadow-lg transition hover:scale-105 hover:bg-red-50 md:top-1/2 md:h-9 md:w-9"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={showNextSlide}
                aria-label="Next slide"
                className="absolute right-2 top-[57%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/95 text-red-600 shadow-lg transition hover:scale-105 hover:bg-red-50 md:top-1/2 md:h-9 md:w-9"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between gap-3 md:left-8 md:right-8">
                <div className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-red-600 shadow-md">
                  0{currentSlide + 1} / 0{heroSlides.length}
                </div>

                <div className="scrollbar-none flex max-w-[72%] items-center gap-1 overflow-x-auto rounded-full bg-white/95 px-2 py-1.5 shadow-md">
                  {heroSlides.map((slide, index) => (
                    <button
                      key={slide._id || index}
                      onClick={() => goToSlide(index)}
                      className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] transition-all ${
                        currentSlide === index
                          ? "bg-red-600 text-white"
                          : "bg-transparent text-gray-500 hover:text-red-600"
                      }`}
                    >
                      {slide.eyebrow || `Slide ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex min-h-[320px] items-center justify-center text-white">
              <p className="text-sm font-semibold">No sliders available</p>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 pb-3 pt-7 md:px-16 md:pt-10">
        <div className="mx-auto grid max-w-7xl gap-5 rounded-[28px] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:grid-cols-[0.95fr_1.05fr] md:items-center md:px-10 md:py-9">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-red-600">
              Serving Sharjah for over 15 years
            </p>
            <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              Alam Computer – Your Trusted Computer &amp; Printer Shop in Sharjah
            </h1>
          </div>
          <div className="border-t border-slate-200 pt-5 md:border-l md:border-t-0 md:pl-10 md:pt-0">
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Alam Computer has been serving Sharjah and the wider UAE for over 15 years, offering computer sales, printer sales, repair services, and a wide range of spare parts. Whether you need a new laptop, a printer repaired, or hard-to-find computer components, our team in Industrial Area 3, Sharjah is ready to help — in-store or online.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-slate-700">
              <span className="rounded-full bg-red-50 px-3 py-2">Sales</span>
              <span className="rounded-full bg-red-50 px-3 py-2">Repairs</span>
              <span className="rounded-full bg-red-50 px-3 py-2">Spare Parts</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 border-y border-slate-100 bg-slate-50 px-4 py-5 md:mt-6 md:px-16">
        <div className="grid grid-cols-5 items-center gap-x-5 gap-y-4 md:flex md:justify-between">
          {brands.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="brand"
              className="mx-auto h-7 w-full object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-14"
            />
          ))}
        </div>
      </section>

      <section className="mt-10 px-4 md:px-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="rounded bg-gray-200 px-4 py-2 text-lg font-bold text-gray-700 md:text-2xl">
            FEATURED CATEGORIES
          </h2>

          <button
            onClick={() => navigate("/shop/listing")}
            className="hidden rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 md:block"
          >
            View All
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {featuredCategoryCards.map(({ title, category, description, Icon }) => (
            <button
              key={category}
              type="button"
              onClick={() => handleFeaturedCategoryClick(category)}
              className="group flex min-h-[180px] flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition group-hover:bg-red-600 group-hover:text-white">
                  {React.createElement(Icon, { className: "h-7 w-7" })}
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 transition group-hover:bg-red-50 group-hover:text-red-600">
                  Shop
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-950">
                  {title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <button
            onClick={() => navigate("/shop/listing")}
            className="rounded bg-red-600 px-6 py-2 text-sm text-white hover:bg-red-700"
          >
            View All Products
          </button>
        </div>
      </section>

      <section className="mt-10 px-4 md:px-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="rounded bg-gray-200 px-4 py-2 text-lg font-bold text-gray-700 md:text-2xl">
            FEATURED PRODUCTS
          </h2>

          <button
            onClick={() => navigate("/shop/listing")}
            className="hidden rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 md:block"
          >
            View All
          </button>
        </div>

        {isLoading && (
          <p className="mt-6 text-center text-gray-500">Loading products...</p>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            !isLoading && (
              <div className="col-span-full py-10 text-center">
                <p className="font-semibold text-gray-500">
                  No products available
                </p>
              </div>
            )
          )}
        </div>

        <div className="mt-6 text-center md:hidden">
          <button
            onClick={() => navigate("/shop/listing")}
            className="rounded bg-red-600 px-6 py-2 text-sm text-white hover:bg-red-700"
          >
            View All Products
          </button>
        </div>
      </section>

      <section className="mt-14 bg-slate-50 px-4 py-14 md:px-16 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-red-600">Local sales, service &amp; support</p>
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Everything you need, from one trusted Sharjah computer shop.</p>
          </div>
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
            <h2 className="text-2xl font-black text-slate-950">Computer &amp; Laptop Sales in Sharjah</h2>
            <p className="mt-3 leading-7 text-slate-600">We stock a wide range of desktop computers, laptops, and accessories from trusted brands, suited for home, office, and business use. Our team can help you choose the right system for your budget and needs — visit our shop in Industrial Area 3, Sharjah, or contact us for current stock and pricing.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
            <h2 className="text-2xl font-black text-slate-950">Printer Sales &amp; Repair</h2>
            <p className="mt-3 leading-7 text-slate-600">Alam Computer sells new and refurbished printers and provides fast, reliable printer repair services for homes and businesses across Sharjah. From ink and toner issues to hardware faults, our technicians diagnose and fix most printer problems on the same day.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
            <h2 className="text-2xl font-black text-slate-950">Computer Spare Parts</h2>
            <p className="mt-3 leading-7 text-slate-600">Looking for a specific computer part? We carry a large selection of spare parts — including RAM, hard drives, SSDs, motherboards, power supplies, and cables — for most major brands and models. If we don&apos;t have it in stock, we can help source it quickly.</p>
          </article>

          <article className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#270909,#991b1b)] p-7 text-white shadow-xl md:col-span-3">
            <div className="grid gap-5 md:grid-cols-[0.45fr_1fr] md:items-center">
            <div>
              <p className="text-5xl font-black text-red-300">15+</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Years in Sharjah</p>
            </div>
            <div>
            <h2 className="text-2xl font-black">Why Choose Alam Computer</h2>
            <p className="mt-3 leading-7 text-white/80">With over 15 years serving the Sharjah community, Alam Computer has built a reputation for honest pricing and reliable service — reflected in our 4.3-star rating from 77+ Google reviews. We&apos;re a local shop you can walk into, talk to, and trust.</p>
            </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-lg md:col-span-3">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div className="p-4 md:p-7">
                <h2 className="text-2xl font-black text-slate-950">Visit Our Shop</h2>
                <p className="mt-3 leading-7 text-slate-600">Find us in {storeContact.address}. Call <a className="font-bold text-red-600 hover:underline" href={storeContact.phoneHref}>{storeContact.phoneDisplay}</a> to check stock, ask about repairs, or get directions. Open Monday–Saturday, 09:00–21:00.</p>
                <a href={storeContact.directionsHref} className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700" {...externalLinkProps}>Get Directions</a>
              </div>
              <iframe title="Alam Computer shop in Industrial Area 3, Sharjah" src={storeContact.mapEmbedUrl} width="100%" height="320" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-[280px] rounded-xl" />
            </div>
          </article>
        </div>
        </div>
      </section>

      <ProductDetailsDialog
        open={open}
        setOpen={handleCloseDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
        requiresLogin={false}
      />

      {showPopup && popup && (
        <PopupModal
          popup={popup}
          product={popupProduct}
          onClose={handleClosePopup}
          onDismiss={handleDismissPopup}
          onShopNow={handlePopupShopNow}
          isAddingToCart={popupCartLoading}
        />
      )}
    </div>
  );
};

export default Home;
