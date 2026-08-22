import { writeFile } from "node:fs/promises";
import { categoryToSlug, slugify } from "../src/lib/shopUrls.js";

const SITE_URL =
  process.env.VITE_SITE_URL || "https://alamcomputer.com";

const API_URL =
  process.env.VITE_API_URL || "https://api.alamcomputer.com";

const staticUrls = [
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

const escapeXml = (value = "") =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const createUrlEntry = (url) => `
  <url>
    <loc>${escapeXml(url)}</loc>
  </url>`;

async function generateSitemap() {
  console.log("Generating sitemap...");
  console.log(`Using API: ${API_URL}`);

  const response = await fetch(
    `${API_URL}/api/shop/products/get?sortBy=price-lowtohigh`,
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products for sitemap: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();
  const products = Array.isArray(result?.data) ? result.data : [];

  const staticEntries = staticUrls.map(
    (path) => `${SITE_URL}${path}`,
  );

  const productEntries = products
    .filter(
      (product) =>
        product?._id &&
        product?.title &&
        product?.category,
    )
    .map((product) => {
      const categorySlug = categoryToSlug(product.category);
      const productSlug = slugify(product.title);

      return `${SITE_URL}/${categorySlug}/${product._id}/${productSlug}`;
    });

  const allUrls = [...new Set([...staticEntries, ...productEntries])];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(createUrlEntry).join("\n")}
</urlset>
`;

  await writeFile("public/sitemap.xml", sitemap, "utf8");

  console.log(
    `Sitemap generated with ${allUrls.length} URLs (${productEntries.length} product URLs).`,
  );
}

generateSitemap().catch((error) => {
  console.error("Sitemap generation failed:");
  console.error(error);
  process.exit(1);
});
