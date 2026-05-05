import axios from "axios";
import { ImagePlus, UploadCloudIcon, XIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { getApiUrl } from "@/config/api";

const initialFormData = {
  title: "",
  description: "",
  imageUrl: "",
  productId: "",
  buttonText: "Shop Now",
  buttonLink: "/",
  isActive: false,
  startDate: "",
  endDate: "",
};

function PopupForm({
  formData,
  setFormData,
  handleSubmit,
  editingId,
  setEditingId,
  imageFile,
  setImageFile,
  imageLoadingState,
  setImageLoadingState,
  saving,
  products = [],
  setOpenCreateProductsDialog,
}) {
  const inputRef = useRef(null);

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
    setImageFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (setOpenCreateProductsDialog) {
      setOpenCreateProductsDialog(false);
    }
  };

  const handleImageFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setImageFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    const uploadPopupImage = async () => {
      if (!imageFile) return;

      try {
        setImageLoadingState(true);
        const data = new FormData();
        data.append("image", imageFile);

        const response = await axios.post(
          getApiUrl("/api/admin/popup/upload-image"),
          data
        );

        if (response?.data?.success) {
          setFormData((prev) => ({
            ...prev,
            imageUrl: response.data.result.secure_url || response.data.result.url,
          }));
        }
      } catch (error) {
        console.error(
          error.response?.data?.message || "Popup image upload request failed"
        );
      } finally {
        setImageLoadingState(false);
      }
    };

    uploadPopupImage();
  }, [imageFile, setFormData, setImageLoadingState]);

  return (
    <div className="rounded-lg bg-white p-4 shadow sm:p-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingId ? "Update Popup" : "Create Popup"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter popup title"
            className="w-full border rounded-md px-3 py-2 outline-none"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter popup description"
            className="w-full border rounded-md px-3 py-2 outline-none"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Popup Image</label>

          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4">
            <input
              id="popup-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputRef}
              onChange={handleImageFileChange}
            />

            {!imageFile && !formData.imageUrl ? (
              <label
                htmlFor="popup-image-upload"
                className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <UploadCloudIcon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700">
                  Upload Popup Image
                </span>
                <span className="mt-1 text-xs text-slate-400">
                  Click to choose an image from your computer
                </span>
              </label>
            ) : imageLoadingState ? (
              <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
                <p className="mt-3 text-xs font-semibold text-slate-500">
                  Uploading image...
                </p>
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Popup preview"
                    className="h-44 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-44 flex-col items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                    <ImagePlus className="h-10 w-10" />
                    <p className="mt-2 text-sm">Image selected</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-slate-600 shadow hover:text-red-600"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 outline-none"
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Button Text</label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            placeholder="Enter button text"
            className="w-full border rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Button Link</label>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            placeholder="Enter button link"
            className="w-full border rounded-md px-3 py-2 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-none"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 outline-none"
              required
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label className="font-medium">Active</label>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <button
            type="submit"
            disabled={imageLoadingState || saving}
            className="rounded-md bg-black px-4 py-2 text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {imageLoadingState
              ? "Uploading Image..."
              : saving
                ? editingId
                  ? "Updating..."
                  : "Creating..."
                : editingId
                  ? "Update Popup"
                  : "Create Popup"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border px-4 py-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default PopupForm;
