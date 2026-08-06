export const categorySlugMap = {
  laptops: "Laptop",
  monitors: "Lcd",
  printers: "Printer",
  ink: "Ink",
  "solid-state-drives": "SSD",
  networking: "Network",
  "all-in-one-computers": "All In One",
  toners: "Towner",
  accessories: "accessories",
};

export const slugify = (value = "") =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const categoryToSlug = (category = "") =>
  Object.entries(categorySlugMap).find(([, value]) => value.toLowerCase() === category.toLowerCase())?.[0] || slugify(category);

export const productUrl = (product) =>
  `/${categoryToSlug(product?.category)}/${product?._id}/${slugify(product?.title)}`;
