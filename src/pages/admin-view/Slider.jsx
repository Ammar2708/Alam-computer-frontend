import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  createSlider,
  deleteSlider,
  fetchAllSliders,
  updateSlider,
} from "@/store/slider/sliderSlice";
import SliderForm from "@/components/admin-view/dummy/Slider-form";

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

function SliderPage() {
  const dispatch = useDispatch();
  const { sliderList = [], isLoading } = useSelector((state) => state.slider || {});

  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);

  useEffect(() => {
    dispatch(fetchAllSliders());
  }, [dispatch]);

  useEffect(() => {
    if (uploadedImageUrl) {
      setFormData((prev) => ({
        ...prev,
        image: uploadedImageUrl,
      }));
    }
  }, [uploadedImageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageLoadingState) {
      toast.error("Please wait for the image to finish uploading");
      return;
    }

    if (!uploadedImageUrl && !formData.image) {
      toast.error("Please upload a slider image before saving");
      return;
    }

    const payload = {
      ...formData,
      image: uploadedImageUrl || formData.image,
      order: Number(formData.order) || 0,
      highlights:
        typeof formData.highlights === "string"
          ? formData.highlights
              .split(",")
              .map((item) => item.trim())
              .filter((item) => item !== "")
          : formData.highlights,
    };

    try {
      let result;

      if (editingId) {
        result = await dispatch(updateSlider({ id: editingId, formData: payload }));
      } else {
        result = await dispatch(createSlider(payload));
      }

      if (result?.meta?.requestStatus === "fulfilled") {
        toast.success(editingId ? "Slider updated successfully" : "Slider created successfully");
        setFormData(initialFormData);
        setEditingId(null);
        setImageFile(null);
        setUploadedImageUrl(null);
        dispatch(fetchAllSliders());
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to save slider");
    }
  };

  const handleEdit = (slider) => {
    setEditingId(slider._id);
    setFormData({
      title: slider.title || "",
      description: slider.description || "",
      image: slider.image || "",
      eyebrow: slider.eyebrow || "",
      accent: slider.accent || "",
      statLabel: slider.statLabel || "",
      statValue: slider.statValue || "",
      highlights: Array.isArray(slider.highlights)
        ? slider.highlights.join(", ")
        : "",
      buttonText: slider.buttonText || "Shop Now",
      buttonLink: slider.buttonLink || "/shop/listing",
      order: slider.order || 0,
      isActive: slider.isActive ?? true,
    });
    setImageFile(null);
    setUploadedImageUrl(slider.image || null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this slider?");
    if (!confirmDelete) return;

    const result = await dispatch(deleteSlider(id));

    if (result?.meta?.requestStatus === "fulfilled") {
      toast.success("Slider deleted successfully");
      dispatch(fetchAllSliders());
    } else {
      toast.error("Failed to delete slider");
    }
  };

  const handleResetImageState = () => {
    setImageFile(null);
    setUploadedImageUrl(null);
    setImageLoadingState(false);
  };

  return (
    <div className="min-w-0 space-y-6 p-0 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Slider Management
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage homepage hero slides with the same workflow used across the admin panel.
        </p>
      </div>

      <div className="min-w-0 space-y-6">
      <SliderForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editingId={editingId}
        setEditingId={setEditingId}
        imageFile={imageFile}
        setImageFile={setImageFile}
        imageLoadingState={imageLoadingState}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        onResetImageState={handleResetImageState}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-5 text-xl font-bold text-slate-900">All Sliders</h2>

        {isLoading ? (
          <p className="text-slate-500">Loading sliders...</p>
        ) : sliderList.length === 0 ? (
          <p className="text-slate-500">No sliders found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sliderList.map((slider) => (
              <article
                key={slider._id}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-slate-100 p-4">
                  <img
                    src={slider.image}
                    alt={slider.title}
                    className="h-full w-full rounded-2xl object-contain"
                  />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
                      {slider.eyebrow || "Slider"}
                    </span>
                    {slider.accent ? (
                      <span className="rounded-full bg-red-600 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-sm">
                        {slider.accent}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-7 text-slate-900">
                        {slider.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-500">
                        {slider.description || "No description added for this slider yet."}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                        slider.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {slider.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Order
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-900">
                        {slider.order}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Button
                      </p>
                      <p className="mt-1 line-clamp-1 text-base font-semibold text-slate-900">
                        {slider.buttonText || "Shop Now"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
                    <button
                      onClick={() => handleEdit(slider)}
                      className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slider._id)}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default SliderPage;
