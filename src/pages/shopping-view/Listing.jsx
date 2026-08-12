
import React, { useEffect, useMemo, useState } from "react";
import ProductFilter from "@/components/shoppping-view/Filter";
import ShoppingProductTile from "@/components/shoppping-view/ProductTile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ArrowUpDownIcon, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
} from "@/store/shop/product-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useParams, useSearchParams } from "react-router-dom";
import { getCartOwnerId } from "@/utils/cartOwner";
import PageSeo from "@/components/seo/PageSeo";
import { categorySlugMap } from "@/lib/shopUrls";

const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

const filterParamKeys = ["category", "brand"];
const removedCategoryIds = ["HDD"];

const categoryLabelMap = {
  Laptop: "Laptops",
  Lcd: "Monitors",
  LCD: "Monitors",
  Printer: "Printers",
  Ink: "Ink",
  SSD: "SSD",
  Network: "Network",
  "All In One": "All-in-One",
  Towner: "Toners",
  accessories: "Accessories",
};

function getFiltersFromSearchParams(searchParams) {
  return filterParamKeys.reduce((acc, key) => {
    const value = searchParams.get(key);

    if (value) {
      const values = value.split(",").filter(Boolean);
      acc[key] =
        key === "category"
          ? values.filter((category) => !removedCategoryIds.includes(category))
          : values;

      if (acc[key].length === 0) {
        delete acc[key];
      }
    }

    return acc;
  }, {});
}

function createSearchParamsHelper(filters, existingSearchParams) {
  const params = new URLSearchParams(existingSearchParams);

  // Remove old filter params while keeping the search state.
  [...params.keys()].forEach((key) => {
    if (key !== "search") {
      params.delete(key);
    }
  });

  for (const [key, value] of Object.entries(filters)) {
    if (Array.isArray(value) && value.length > 0) {
      params.set(key, value.join(","));
    }
  }

  return params;
}

function removeUnavailableCategoriesFromSearchParams(existingSearchParams) {
  const params = new URLSearchParams(existingSearchParams);
  const categoryParam = params.get("category");

  if (!categoryParam) return params;

  const categories = categoryParam.split(",").filter(Boolean);
  const availableCategories = categories.filter(
    (category) => !removedCategoryIds.includes(category)
  );

  if (availableCategories.length > 0) {
    params.set("category", availableCategories.join(","));
  } else {
    params.delete("category");
  }

  return params;
}

const ShoppingListing = ({ setOpenCartSheet }) => {
  const dispatch = useDispatch();

  const { productList = [] } = useSelector(
    (state) => state.shopProducts || {}
  );
  const { user = null } = useSelector((state) => state.auth || {});
  const { cartItems = { items: [] } } = useSelector((state) => state.cart || {});

  const [sort, setSort] = useState("price-lowtohigh");
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsString = searchParams.toString();
  const filters = useMemo(() => {
    const result = getFiltersFromSearchParams(new URLSearchParams(searchParamsString));
    if (categorySlugMap[categorySlug]) result.category = [categorySlugMap[categorySlug]];
    return result;
  }, [categorySlug, searchParamsString]);
  const searchQuery = searchParams.get("search")?.trim() || "";
  const categoryTitle = filters.category
    ?.map((category) => categoryLabelMap[category] || category)
    .join(", ");
  const listingTitle = searchQuery
    ? `Search results for "${searchQuery}"${
        categoryTitle ? ` in ${categoryTitle}` : ""
      }`
    : categoryTitle
    ? categoryTitle
    : "All Products";
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (sectionId, currentOption) => {
    let cpyFilters = { ...filters };

    if (!cpyFilters[sectionId]) {
      cpyFilters[sectionId] = [currentOption];
    } else {
      const optionIndex = cpyFilters[sectionId].indexOf(currentOption);

      if (optionIndex === -1) {
        cpyFilters[sectionId] = [...cpyFilters[sectionId], currentOption];
      } else {
        cpyFilters[sectionId] = cpyFilters[sectionId].filter(
          (item) => item !== currentOption
        );
      }

      if (cpyFilters[sectionId].length === 0) {
        delete cpyFilters[sectionId];
      }
    }

    setSearchParams(createSearchParamsHelper(cpyFilters, searchParams));
  };

  const addProductToCartForUser = async (getCurrentProductId, loggedInUser = user) => {
    const activeUserId = getCartOwnerId(loggedInUser);
    const currentProduct =
      productList?.find((product) => product._id === getCurrentProductId);

    if (!currentProduct) {
      toast.error("Product not found");
      return;
    }

    const currentCartItem = cartItems?.items?.find(
      (item) => item.productId === getCurrentProductId
    );

    const currentQuantity = currentCartItem?.quantity || 0;
    const availableStock = currentProduct?.totalStock || 0;

    if (currentQuantity + 1 > availableStock) {
      toast.error(`Only ${availableStock} item(s) available in stock`);
      return;
    }

    dispatch(
      addToCart({
        userId: activeUserId,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then(async (data) => {
      if (data?.payload?.success) {
        await dispatch(fetchCartItems(activeUserId));
        toast.success("Item added to cart");
        setOpenCartSheet?.(true);
      } else {
        toast.error(data?.payload?.message || "Failed to add item to cart");
      }
    });
  };

  const handleAddToCart = (getCurrentProductId) => {
    addProductToCartForUser(getCurrentProductId, user);
  };

  useEffect(() => {
    const cleanedParams =
      removeUnavailableCategoriesFromSearchParams(searchParamsString);

    if (cleanedParams.toString() !== searchParamsString) {
      setSearchParams(cleanedParams, { replace: true });
    }
  }, [searchParamsString, setSearchParams]);

  // fetch filtered products
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filtersParams: {
          ...filters,
          ...(searchQuery ? { search: searchQuery } : {}),
        },
        sortParams: sort,
      })
    );
  }, [dispatch, filters, searchQuery, sort]);

  return (
    <>
      <PageSeo title={`${listingTitle} – Computer Shop UAE`} description={`Shop ${listingTitle.toLowerCase()} from Alam Computer. Browse specifications, prices and availability in the UAE.`} canonical={`${(import.meta.env.VITE_SITE_URL || "http://localhost:3000").replace(/\/$/, "")}${categorySlug ? `/${categorySlug}` : "/shop/listing"}`} />
      <div className="flex min-h-screen flex-col gap-4 bg-gray-50 p-3 sm:p-4 lg:flex-row lg:gap-6">
        <div className="rounded-[28px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_32%),linear-gradient(135deg,#dc2626,#991b1b)] p-4 text-white shadow-[0_18px_40px_rgba(153,27,27,0.22)] lg:hidden">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-100">
            Mobile Catalog
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase leading-tight tracking-tight">
            {listingTitle}
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-100">
                Results
              </p>
              <p className="mt-1 text-2xl font-black">{productList?.length || 0}</p>
            </div>
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-3 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-600 shadow-md"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>

          {searchQuery ? (
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("search");
                setSearchParams(params);
              }}
              className="mt-3 rounded-full bg-black/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-white ring-1 ring-white/15"
            >
              Clear search
            </button>
          ) : null}
        </div>

        <div className="hidden rounded-xl border bg-white p-4 lg:block lg:w-[260px] lg:shrink-0">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </div>

        <div className="min-w-0 flex-1 rounded-xl border bg-white">
          <div className="border-b p-4 lg:hidden">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase text-red-600">
                {productList?.length || 0} Products
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileFilterOpen(true)}
                  className="gap-1 rounded-full"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filter
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 rounded-full"
                    >
                      <ArrowUpDownIcon className="h-4 w-4" />
                      <span>Sort</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                      {sortOptions.map((sortItem) => (
                        <DropdownMenuRadioItem
                          key={sortItem.id}
                          value={sortItem.id}
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="hidden flex-col gap-4 border-b p-5 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-extrabold">
                {listingTitle}
              </h2>
              {searchQuery ? (
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("search");
                    setSearchParams(params);
                  }}
                  className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-red-600 hover:underline"
                >
                  Clear search
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {productList?.length || 0} Products
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        key={sortItem.id}
                        value={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 min-[430px]:grid-cols-2 sm:p-5 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {productList.length > 0 ? (
              productList.map((product) => (
                <ShoppingProductTile
                  key={product._id}
                  product={product}
                  handleAddToCart={handleAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full py-10 text-center font-medium text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>

      </div>

      <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
        <SheetContent side="left" className="w-[90vw] overflow-y-auto bg-white p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-red-100 bg-red-600 px-5 py-5 text-left">
            <SheetTitle className="text-lg font-black uppercase text-white">
              Filter Products
            </SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ShoppingListing;
