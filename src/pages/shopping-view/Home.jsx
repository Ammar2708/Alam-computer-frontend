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
} from "@/store/shop/product-slice";
import { getApiUrl } from "@/config/api";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ShoppingProductTile from "@/components/shoppping-view/ProductTile";
import PopupModal from "@/components/comman/PopupModel";
import { getCartOwnerId } from "@/utils/cartOwner";
import PageSeo from "@/components/seo/PageSeo";
import { externalLinkProps, storeContact } from "@/config/contact";
import { setPublicSliders } from "@/store/slider/sliderSlice";

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

const optimizeCloudinaryImage = (url, width = 700) => {
  if (
    !url ||
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com") ||
    !url.includes("/upload/")
  ) {
    return url;
  }

  return url.replace(
    "/upload/",
    `/upload/f_auto,q_auto:good,c_limit,w_${width}/`
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const siteUrl = (import.meta.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const storeStructuredData = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    name: "Alam Computer",
    image: `${siteUrl}/logo1.webp`,
    url: siteUrl,
    telephone: "+971 52 803 6944",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "J&P Signal, Industrial Area 3",
      addressLocality: "Sharjah",
      addressRegion: "Sharjah",
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
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 4.3,
      reviewCount: 77,
    },
  };

  const [currentSlide, setCurrentSlide] = useState(0);


  const [popup, setPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCartLoading, setPopupCartLoading] = useState(false);

  const { productList = [], isLoading } = useSelector(
    (state) => state.shopProducts || {}
  );
  const heroSlides = useSelector(
  (state) => state.slider?.sliderList || []
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
  const availableCategoryCards = useMemo(
    () =>
      featuredCategoryCards.filter(({ category }) =>
        productList.some(
          (product) =>
            product?.category?.trim().toLowerCase() === category.toLowerCase(),
        ),
      ),
    [productList],
  );

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({}));
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
  
    const fetchSliders = async () => {
      try {
        const res = await fetch(getApiUrl("/api/slider"));
        const data = await res.json();
  
        if (isMounted && data?.success) {
          dispatch(setPublicSliders(data.data || []));
        }
      } catch (error) {
        console.log("Slider fetch error:", error);
      }
    };
  
    fetchSliders();
  
    return () => {
      isMounted = false;
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
        : productList?.find((product) => product._id === productId);

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
      <PageSeo title="Computer Shop in Sharjah" description="Alam Computer is a trusted computer shop in Sharjah for laptops, printers, computer repairs, accessories and spare parts. Visit our Industrial Area 3 store or contact us for current stock and service." canonical={`${siteUrl}/`} image={`${siteUrl}/logo1.webp`} structuredData={storeStructuredData} />
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
                                src={optimizeCloudinaryImage(slide.image, 700)}
                                srcSet={
                                  slide.image?.includes("res.cloudinary.com")
                                    ? `${optimizeCloudinaryImage(slide.image, 520)} 520w, ${optimizeCloudinaryImage(slide.image, 700)} 700w, ${optimizeCloudinaryImage(slide.image, 900)} 900w`
                                    : undefined
                                }
                                sizes="(max-width: 768px) calc(100vw - 48px), 430px"
                                alt={slide.title}
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "low"}
                                decoding={index === 0 ? "sync" : "async"}
                                width="860"
                                height="490"
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

      <section className="px-4 pb-4 pt-7 md:px-16 md:pt-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[radial-gradient(circle_at_85%_10%,rgba(239,68,68,0.34),transparent_28%),linear-gradient(135deg,#09090b_0%,#1c0a0a_56%,#3a0b0b_100%)] text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full border border-white/10" />

          <div className="relative grid gap-8 px-6 py-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-12 md:py-12 lg:px-16">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-red-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-red-400" />
                Trusted in the UAE for 15+ years
              </div>
              <h1 className="max-w-2xl text-3xl font-black leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
                Computer Shop in Sharjah for Laptops, Printers & Repairs.
              </h1>
              <p className="mt-5 max-w-xl text-sm font-medium leading-7 text-slate-300 md:text-base">
                Shop computers, laptops, printers, accessories, and spare parts from a trusted computer shop in Sharjah. Alam Computer also provides reliable computer, laptop, and printer repair support for homes and businesses.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/shop/listing")}
                  className="rounded-xl bg-red-600 px-6 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_12px_28px_rgba(220,38,38,0.35)] transition hover:-translate-y-0.5 hover:bg-red-500"
                >
                  Shop Products
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/shop/contact")}
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  Ask Our Team
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm sm:col-span-2">
                <p className="text-4xl font-black text-red-400">15+</p>
                <p className="mt-1 text-sm font-bold text-white">Years serving homes and businesses</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">Local experience, honest guidance, and support after your purchase.</p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm transition hover:border-red-400/40 hover:bg-white/10">
                <Zap className="h-6 w-6 text-red-400" />
                <p className="mt-4 font-black">Sales &amp; Repairs</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Products and practical technical help in one place.</p>
              </div>
              <div className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm transition hover:border-red-400/40 hover:bg-white/10">
                <Truck className="h-6 w-6 text-red-400" />
                <p className="mt-4 font-black">Across the UAE</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Convenient online ordering with local assistance.</p>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/15 px-3 py-4 text-center text-[10px] font-black uppercase tracking-[0.14em] text-slate-300 sm:text-xs">
            <span>Computers</span>
            <span>Printers</span>
            <span>Spare Parts</span>
          </div>
        </div>
      </section>

      <section className="mt-5 border-y border-slate-100 bg-slate-50 px-4 py-5 md:mt-6 md:px-16">
        <div className="grid grid-cols-5 items-center gap-x-5 gap-y-4 md:flex md:justify-between">
          {brands.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Technology brand"
              loading="lazy"
              decoding="async"
              width="180"
              height="72"
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
          {availableCategoryCards.map(({ title, category, description, Icon }) => (
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
            <p className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">Computers, Repairs, Printers &amp; Parts from a Trusted Sharjah Computer Shop</p>
          </div>
        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
            <h2 className="text-2xl font-black text-slate-950">Computers &amp; Laptops in Sharjah</h2>
            <p className="mt-3 leading-7 text-slate-600">Browse desktop computers, laptops, and accessories for home, office, and business use. Alam Computer serves customers across Sharjah with new and reliable tech products from trusted brands, along with practical advice to help you choose the right system for your needs and budget.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
            <h2 className="text-2xl font-black text-slate-950">Printer Sales &amp; Repair in Sharjah</h2>
            <p className="mt-3 leading-7 text-slate-600">Alam Computer supplies new and refurbished printers and provides printer repair support for homes and businesses in Sharjah. We help with common issues involving ink, toner, print quality, hardware faults, and general printer servicing, with practical advice on repair or replacement options.</p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
            <h2 className="text-2xl font-black text-slate-950">Computer Parts &amp; Accessories in Sharjah</h2>
            <p className="mt-3 leading-7 text-slate-600">Find computer parts and accessories in Sharjah including RAM, SSDs, hard drives, motherboards, power supplies, cables, and other replacement components. Alam Computer stocks parts for a range of major brands and can help source specific items when they are not immediately available.</p>
          </article>

          <article className="overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#270909,#991b1b)] p-7 text-white shadow-xl md:col-span-3">
            <div className="grid gap-5 md:grid-cols-[0.45fr_1fr] md:items-center">
            <div>
              <p className="text-5xl font-black text-red-300">15+</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.2em] text-white/70">Years in Sharjah</p>
            </div>
            <div>
            <h2 className="text-2xl font-black">Why Choose Alam Computer</h2>
            <p className="mt-3 leading-7 text-white/80">With more than 15 years serving customers in Sharjah, Alam Computer provides computer sales, repairs, printers, accessories, and spare parts with practical advice and local support. Customers can visit our physical shop in Industrial Area 3 for product guidance, repair enquiries, and current stock availability.</p>
            </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-lg md:col-span-3">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
              <div className="p-4 md:p-7">
                <h2 className="text-2xl font-black text-slate-950">Visit Our Computer Shop in Sharjah</h2>
                <p className="mt-3 leading-7 text-slate-600">Find us in {storeContact.address}. Call <a className="font-bold text-red-600 hover:underline" href={storeContact.phoneHref}>{storeContact.phoneDisplay}</a> to check stock, ask about repairs, or get directions. Open Saturday-Thursday, 10:00–22:00.</p>
                <a href={storeContact.directionsHref} className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700" {...externalLinkProps}>Get Directions</a>
              </div>
              <iframe title="Alam Computer shop in Industrial Area 3, Sharjah" src={storeContact.mapEmbedUrl} width="100%" height="320" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="min-h-[280px] rounded-xl" />
            </div>
          </article>
        </div>
        </div>
      </section>

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
