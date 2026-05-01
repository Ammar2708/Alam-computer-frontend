import { FileIcon, UploadCloudIcon, XIcon, ImagePlus } from "lucide-react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import axios from "axios";
import { useRef } from "react";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
  uploadUrl = "http://localhost:3000/api/admin/products/upload-image",
  label = "Product Media",
  createText = "Upload Product Image",
  replaceText = "Replace Product Image",
  tipText = "Tip: Use high-res images on white backgrounds for best store results.",
  multiple = false,
  maxImages = 6,
}) {
  const inputRef = useRef(null);
  const uploadInputId = multiple ? "multi-product-image-upload" : "image-upload";
  const selectedFiles = Array.isArray(imageFile)
    ? imageFile
    : imageFile
    ? [imageFile]
    : [];
  const uploadedImages = multiple
    ? Array.isArray(uploadedImageUrls)
      ? uploadedImageUrls.filter(Boolean)
      : []
    : uploadedImageUrl
    ? [uploadedImageUrl]
    : [];
  const hasMedia = multiple
    ? uploadedImages.length > 0
    : Boolean(imageFile || uploadedImageUrl);

  function clearNativeInput() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function addFiles(files) {
    if (!files.length) return;

    if (multiple) {
      const remainingSlots = Math.max(maxImages - uploadedImages.length, 0);
      if (remainingSlots === 0) return;
      const filesToUpload = files.slice(0, remainingSlots);
      setImageFile(filesToUpload);
      uploadImageToCloudinary(filesToUpload);
      return;
    }

    setImageFile(files[0]);
    uploadImageToCloudinary([files[0]]);
  }

  function handleImageFileChange(event) {
    addFiles(Array.from(event.target.files || []));
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    addFiles(Array.from(event.dataTransfer.files || []));
  }

  function handleRemoveImage(index) {
    if (multiple && typeof index === "number") {
      const nextImages = uploadedImages.filter((_, imageIndex) => imageIndex !== index);
      setUploadedImageUrls?.(nextImages);
      setUploadedImageUrl?.(nextImages[0] || null);
      setImageFile([]);
      clearNativeInput();
      return;
    }

    setImageFile(multiple ? [] : null);
    setUploadedImageUrl(null);
    setUploadedImageUrls?.([]);
    clearNativeInput();
  }

  async function uploadSingleImage(file) {
    const data = new FormData();
    data.append("image", file);
    const response = await axios.post(uploadUrl, data);

    if (!response?.data?.success) return null;

    return response.data.result.secure_url || response.data.result.url;
  }

  async function uploadImageToCloudinary(filesToUpload) {
    try {
      setImageLoadingState(true);

      if (multiple) {
        const uploadedUrls = [];

        for (const file of filesToUpload) {
          const uploadedUrl = await uploadSingleImage(file);
          if (uploadedUrl) uploadedUrls.push(uploadedUrl);
        }

        const nextImages = [...uploadedImages, ...uploadedUrls].slice(0, maxImages);
        setUploadedImageUrls?.(nextImages);
        setUploadedImageUrl?.(nextImages[0] || null);
        return;
      }

      const uploadedUrl = await uploadSingleImage(filesToUpload[0]);
      setUploadedImageUrl(uploadedUrl);
    } catch (error) {
      console.error(
        error.response?.data?.message || "Image upload request failed"
      );
      if (multiple) {
        setUploadedImageUrls?.(uploadedImages);
      } else {
        setUploadedImageUrl(null);
      }
    } finally {
      setImageLoadingState(false);
      setImageFile(multiple ? [] : null);
      clearNativeInput();
    }
  }

  return (
    <div className={`mt-4 w-full ${isCustomStyling ? "" : "mx-auto max-w-md"}`}>
      <Label className="mb-2 block text-xs font-bold uppercase tracking-widest text-slate-500">
        {label}
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="group relative rounded-xl border-2 border-dashed border-slate-200 bg-white p-2 transition-all duration-300 hover:border-red-400 hover:bg-slate-50/50"
      >
        <Input
          id={uploadInputId}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
        />

        {!hasMedia && !imageLoadingState ? (
          <Label
            htmlFor={uploadInputId}
            className="flex h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-4 text-center transition-all hover:bg-white"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 transition-transform group-hover:scale-110">
              <UploadCloudIcon className="h-6 w-6" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              {isEditMode ? replaceText : createText}
            </span>
            <span className="mt-1 text-[11px] font-medium text-slate-400">
              Drag and drop or click to browse (PNG, JPG)
            </span>
          </Label>
        ) : imageLoadingState ? (
          <div className="flex h-44 flex-col items-center justify-center rounded-lg border border-slate-100 bg-white">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
            <p className="mt-4 text-xs font-bold uppercase tracking-tighter text-slate-500 animate-pulse">
              Uploading to Server...
            </p>
            {multiple ? (
              <p className="mt-1 text-[11px] font-medium text-slate-400">
                {selectedFiles.length} image{selectedFiles.length === 1 ? "" : "s"} selected
              </p>
            ) : null}
          </div>
        ) : multiple ? (
          <div className="rounded-lg border border-slate-100 bg-white p-3">
            <div className="grid grid-cols-2 gap-3">
              {uploadedImages.map((imageUrl, index) => (
                <div
                  key={`${imageUrl}-${index}`}
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                >
                  <img
                    src={imageUrl}
                    alt={`Product upload ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 0 ? (
                    <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Primary
                    </span>
                  ) : null}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-lg transition-transform hover:scale-110"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <XIcon className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove File</span>
                  </Button>
                </div>
              ))}

              {uploadedImages.length < maxImages ? (
                <Label
                  htmlFor={uploadInputId}
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center transition hover:border-red-300 hover:bg-white"
                >
                  <ImagePlus className="mb-2 h-7 w-7 text-red-600" />
                  <span className="text-xs font-bold text-slate-700">Add More</span>
                  <span className="mt-1 text-[10px] font-medium text-slate-400">
                    {uploadedImages.length}/{maxImages}
                  </span>
                </Label>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white p-4">
            {uploadedImageUrl ? (
              <img
                src={uploadedImageUrl}
                alt="Uploaded preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                  <FileIcon className="h-8 w-8 text-red-600" />
                </div>
                <p className="max-w-[200px] truncate text-xs font-bold text-slate-600">
                  {imageFile?.name}
                </p>
                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  Ready to Save
                </div>
              </div>
            )}

            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-3 top-3 h-8 w-8 rounded-full shadow-lg transition-transform hover:scale-110"
              onClick={() => handleRemoveImage()}
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
      <p className="mt-3 text-center text-[10px] font-medium text-slate-400">
        {tipText}
      </p>
    </div>
  );
}

export default ProductImageUpload;
