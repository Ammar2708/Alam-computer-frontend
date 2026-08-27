import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  categorySlugMap,
  categoryToSlug,
  slugify,
} from "../src/lib/shopUrls.js";

const SITE_URL =
  process.env.VITE_SITE_URL || "https://alamcomputer.com";

const API_URL =
  process.env.VITE_API_URL || "https://api.alamcomputer.com";

const staticRoutes = [
  "/",
  "/laptops",
  "/monitors",
  "/printers",
  "/ink",
  "/solid-state-drives",
  "/networking",
  "/all-in-one-computers",
  "/toners",
  "/accessories",
  "/shop/about",
  "/shop/contact",
  "/faq",
  "/terms",
  "/privacy",
  "/privacy-policy",
  "/security",
];

const escapeState = (state) =>
  JSON.stringify(state)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

async function fetchProducts() {
  const response = await fetch(
    `${API_URL}/api/shop/products/get?sortBy=price-lowtohigh`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json();

  return Array.isArray(result?.data)
    ? result.data
    : [];
}

async function fetchPublicSliders() {
  try {
    const response = await fetch(
      `${API_URL}/api/slider`
    );

    if (!response.ok) {
      console.warn(
        `Slider fetch returned ${response.status}. Homepage will prerender without slider data.`
      );

      return [];
    }

    const result = await response.json();

    if (!result?.success) {
      console.warn(
        "Slider API did not return success. Homepage will prerender without slider data."
      );

      return [];
    }

    return Array.isArray(result?.data)
      ? result.data
      : [];
  } catch (error) {
    console.warn(
      "Could not preload sliders during prerender:",
      error.message
    );

    return [];
  }
}

function getAvailableCategories(products) {
  return [
    ...new Set(
      products
        .map((product) =>
          product?.category?.trim().toLowerCase()
        )
        .filter(Boolean)
    ),
  ];
}

function createPreloadedState({
  productList = [],
  productDetails = null,
  availableCategories = [],
  sliderList = [],
} = {}) {
  return {
    shopProducts: {
      productList,
      availableCategories,
      isLoading: false,
      productDetails,
    },

    slider: {
      sliderList,
      isLoading: false,
      error: null,
    },
  };
}

function productsForRoute(products, route) {
  const categorySlug = route.replace(
    /^\/|\/$/g,
    ""
  );

  const category =
    categorySlugMap[categorySlug];

  if (!category) {
    return products;
  }

  return products.filter(
    (product) =>
      product?.category?.trim().toLowerCase() ===
      category.toLowerCase()
  );
}

function outputPathForRoute(route) {
  if (route === "/") {
    return path.resolve(
      "dist/index.html"
    );
  }

  return path.resolve(
    "dist",
    route.replace(/^\/|\/$/g, ""),
    "index.html"
  );
}

async function writeRoute({
  route,
  template,
  render,
  preloadedState,
}) {
  const result =
    render(route, preloadedState);

  const renderedHtml =
    result?.html || "";

  const renderedHead =
    result?.head || "";

  const renderedState =
    result?.state || preloadedState;

  const stateScript =
    `<script>window.__PRELOADED_STATE__=${escapeState(
      renderedState
    )};</script>`;

  const html = template
    .replace(
      "<!--app-head-->",
      renderedHead
    )
    .replace(
      "<!--app-html-->",
      renderedHtml
    )
    .replace(
      "<!--app-state-->",
      stateScript
    );

  const outputPath =
    outputPathForRoute(route);

  await mkdir(
    path.dirname(outputPath),
    {
      recursive: true,
    }
  );

  await writeFile(
    outputPath,
    html,
    "utf8"
  );

  console.log(
    `Prerendered ${route}`
  );
}

async function prerender() {
  console.log(
    "Starting prerender..."
  );

  const [products, sliders] =
    await Promise.all([
      fetchProducts(),
      fetchPublicSliders(),
    ]);

  console.log(
    `Loaded ${products.length} products for prerendering.`
  );

  console.log(
    `Loaded ${sliders.length} homepage slider(s) for prerendering.`
  );

  const availableCategories =
    getAvailableCategories(products);

  const template =
    await readFile(
      "dist/index.html",
      "utf8"
    );

  const serverEntry =
    path.resolve(
      "dist/server/entry-server.js"
    );

  const { render } =
    await import(
      pathToFileURL(serverEntry).href
    );

  for (const route of staticRoutes) {
    const productList =
      route === "/"
        ? products
        : productsForRoute(
            products,
            route
          );

    const preloadedState =
      createPreloadedState({
        productList,
        availableCategories,

        // The homepage needs slider data
        // in its initial prerendered HTML.
        sliderList:
          route === "/"
            ? sliders
            : [],
      });

    await writeRoute({
      route,
      template,
      render,
      preloadedState,
    });
  }

  for (const product of products) {
    if (
      !product?._id ||
      !product?.title ||
      !product?.category
    ) {
      continue;
    }

    const categorySlug =
      categoryToSlug(
        product.category
      );

    const productSlug =
      slugify(
        product.title
      );

    const route =
      `/${categorySlug}/${product._id}/${productSlug}`;

    const preloadedState =
      createPreloadedState({
        productList: products,
        productDetails: product,
        availableCategories,
      });

    await writeRoute({
      route,
      template,
      render,
      preloadedState,
    });
  }

  console.log(
    `Prerender complete: ${staticRoutes.length} static routes and ${products.length} product routes.`
  );
}

prerender().catch((error) => {
  console.error(
    "Prerender failed:"
  );

  console.error(error);

  process.exit(1);
});
