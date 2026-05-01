import ProductImageUpload from "./Image-upload";

const initialFormData = {
  title: "",
  description: "",
  image: "",
  eyebrow: "",
  accent: "",
  statLabel: "",
  statValue: "",
  highlights: "",
  buttonText: "Shop Now",
  buttonLink: "/shop/listing",
  order: 0,
  isActive: true,
};

function SliderForm({
  formData,
  setFormData,
  handleSubmit,
  editingId,
  setEditingId,
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  onResetImageState,
}) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setEditingId(null);
    onResetImageState?.();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {editingId ? "Update Slider" : "Create Slider"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add hero slide content for the shopping homepage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Eyebrow
          </label>
          <input
            type="text"
            name="eyebrow"
            value={formData.eyebrow}
            onChange={handleChange}
            placeholder="Enter eyebrow"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Accent
          </label>
          <input
            type="text"
            name="accent"
            value={formData.accent}
            onChange={handleChange}
            placeholder="Enter accent"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            imageLoadingState={imageLoadingState}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            isEditMode={Boolean(editingId)}
            isCustomStyling
            uploadUrl="http://localhost:3000/api/slider/admin/upload-image"
            label="Slider Media"
            createText="Upload Slider Image"
            replaceText="Replace Slider Image"
            tipText="Tip: Use wide banner images for the homepage slider."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Stat Label
          </label>
          <input
            type="text"
            name="statLabel"
            value={formData.statLabel}
            onChange={handleChange}
            placeholder="Enter stat label"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Stat Value
          </label>
          <input
            type="text"
            name="statValue"
            value={formData.statValue}
            onChange={handleChange}
            placeholder="Enter stat value"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Button Text
          </label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="Enter button text"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Button Link
          </label>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            placeholder="Enter button link"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Order
          </label>
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleChange}
            placeholder="Enter order"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-sm font-medium text-slate-700">Active</label>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows="4"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Highlights
          </label>
          <input
            type="text"
            name="highlights"
            value={formData.highlights}
            onChange={handleChange}
            placeholder="Example: Gaming Laptops, Business PCs, Accessories"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none transition focus:border-red-500"
          />
          <p className="mt-1 text-xs text-slate-500">
            Enter highlights separated by commas.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2 md:col-span-2 sm:flex-row">
          <button
            type="submit"
            className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700"
          >
            {editingId ? "Update Slider" : "Create Slider"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default SliderForm;
