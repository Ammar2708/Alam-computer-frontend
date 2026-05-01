import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
  resetProductDetails,
} from "@/store/shop/product-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ShoppingProductTile from "@/components/shoppping-view/ProductTile";
import ProductDetailsDialog from "@/components/shoppping-view/productDetails";
import PopupModal from "@/components/comman/PopupModel";
import LoginRequiredDialog from "@/components/shoppping-view/LoginRequiredDialog";

const brands = [
  "/img4.png",
  "/img7.png",
  "/img9.png",
  "/img6.png",
  "/img11.png",
  "/img8.png",
  "/img10.png",
  "/img5.png",
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [heroSlides, setHeroSlides] = useState([]);

  const [popup, setPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupCartLoading, setPopupCartLoading] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [pendingCartAction, setPendingCartAction] = useState(null);

  const { productList = [], productDetails = null, isLoading } = useSelector(
    (state) => state.shopProducts || {}
  );
  const { user = null } = useSelector((state) => state.auth || {});
  const { cartItems = { items: [] } } = useSelector(
    (state) => state.cart || {}
  );
  const userId = user?.id || user?._id;

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({}));
  }, [dispatch]);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/slider");
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
    if (!heroSlides.length) return;

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [heroSlides]);

  useEffect(() => {
    let popupTimer;
    let isMounted = true;

    const fetchPopup = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/latest-popup");
        const data = await res.json();

        if (!isMounted) return;

        if (!data) {
          setPopup(null);
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

  const popupProduct =
    (popup?.productId && typeof popup.productId === "object"
      ? popup.productId
      : null) ||
    productList?.find((product) => product._id === popup?.productId) ||
    null;

  const queueLoginForCart = (productId, source = "product") => {
    setPendingCartAction({ productId, source });
    setLoginDialogOpen(true);
  };

  const addProductToCartForUser = async (
    productId,
    loggedInUser = user,
    source = "product"
  ) => {
    const activeUserId = loggedInUser?.id || loggedInUser?._id;

    if (!activeUserId) {
      queueLoginForCart(productId, source);
      return;
    }

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

    if (!userId) {
      queueLoginForCart(popupProductId, "popup");
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
    if (!userId) {
      queueLoginForCart(currentProductId);
      return;
    }

    addProductToCartForUser(currentProductId, user);
  };

  const handleLoginSuccess = async (loggedInUser) => {
    const queuedAction = pendingCartAction;
    setPendingCartAction(null);

    if (!queuedAction?.productId) return;

    try {
      if (queuedAction.source === "popup") {
        setPopupCartLoading(true);
      }

      await addProductToCartForUser(
        queuedAction.productId,
        loggedInUser,
        queuedAction.source
      );
    } finally {
      if (queuedAction.source === "popup") {
        setPopupCartLoading(false);
      }
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
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
      <section className="mt-4 px-4 md:px-16">
        <div className="relative overflow-hidden rounded-[22px] bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.22),_transparent_32%),linear-gradient(135deg,#190707,#2a0d0d_48%,#faf5f5_48.2%,#fff_100%)] shadow-[0_20px_55px_rgba(17,24,39,0.18)] md:rounded-[28px]">
          {heroSlides.length > 0 ? (
            <>
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide._id || index}
                    className="grid min-w-full gap-6 px-5 py-6 md:min-h-[360px] md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-7"
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

                        <h1 className="mt-4 max-w-2xl text-xl font-black uppercase leading-[1.05] tracking-tight min-[380px]:text-2xl md:text-4xl">
                          {slide.title}
                        </h1>

                        <p className="mt-3 max-w-xl text-xs font-medium leading-5 text-white/80 md:text-sm">
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

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                          <div className="flex items-center gap-2 text-red-300">
                            <ShieldCheck className="h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                              Genuine
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-bold text-white/90">
                            Trusted products with solid support.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                          <div className="flex items-center gap-2 text-red-300">
                            <Truck className="h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                              Fast
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-bold text-white/90">
                            Quick processing and delivery support.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur">
                          <div className="flex items-center gap-2 text-red-300">
                            <Zap className="h-4 w-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
                              Ready
                            </span>
                          </div>
                          <p className="mt-2 text-xs font-bold text-white/90">
                            Fast route from browsing to checkout.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <div className="absolute right-2 top-2 hidden h-24 w-24 rounded-full bg-red-500/20 blur-3xl md:block" />
                      <div className="absolute bottom-4 left-0 hidden h-20 w-20 rounded-full bg-black/10 blur-2xl md:block" />

                      <div className="relative w-full max-w-[430px]">
                        <div className="absolute -right-2 top-4 z-10 rounded-[20px] border border-red-200 bg-white px-4 py-3 shadow-xl md:-right-4">
                          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-500">
                            {slide.statLabel}
                          </p>
                          <p className="mt-1 text-2xl font-black text-gray-900">
                            {slide.statValue}
                          </p>
                        </div>

                        <div className="overflow-hidden rounded-[24px] border border-red-100 bg-white p-3 shadow-[0_20px_30px_rgba(239,68,68,0.10)]">
                          <div className="rounded-[18px] bg-[linear-gradient(135deg,#fff_0%,#fff5f5_50%,#fee2e2_100%)] p-3">
                            <img
                              src={slide.image}
                              alt={slide.title}
                              className="h-[170px] w-full rounded-[16px] object-cover md:h-[245px]"
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
                className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-red-100 bg-white text-red-600 shadow-lg transition hover:scale-105 hover:bg-red-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={showNextSlide}
                className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-red-100 bg-white text-red-600 shadow-lg transition hover:scale-105 hover:bg-red-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 md:bottom-4 md:left-8 md:right-8">
                <div className="rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-red-600 shadow-md">
                  0{currentSlide + 1} / 0{heroSlides.length}
                </div>

                <div className="flex max-w-[70%] items-center gap-1 overflow-x-auto rounded-full bg-white/85 px-2 py-1.5 shadow-md">
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

      <section className="mt-6 bg-gray-100 px-4 py-4 md:px-16">
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-between">
          {brands.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="brand"
              className="h-8 object-contain md:h-14"
            />
          ))}
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
          {productList && productList.length > 0 ? (
            productList.slice(0, 4).map((product) => (
              <ShoppingProductTile
                key={product._id}
                product={product}
                handleGetProductDetails={handleGetProductDetails}
                handleAddToCart={handleAddToCart}
                requiresLogin={!userId}
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

      <ProductDetailsDialog
        open={open}
        setOpen={handleCloseDialog}
        productDetails={productDetails}
        handleAddToCart={handleAddToCart}
        requiresLogin={!userId}
      />

      <LoginRequiredDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
        onLoginSuccess={handleLoginSuccess}
        title="Login To Add Item"
        description="Please login to add this product to your cart."
      />

      {showPopup && popup && (
        <PopupModal
          popup={popup}
          product={popupProduct}
          onClose={handleClosePopup}
          onShopNow={handlePopupShopNow}
          isAddingToCart={popupCartLoading}
        />
      )}
    </div>
  );
};

export default Home;
