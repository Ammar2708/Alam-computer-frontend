import { useEffect, useState } from "react";
import axios from "axios";
import PopupForm from "../../components/admin-view/dummy/popup-form";
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

const formatDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const timezoneOffset = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

function PopupPage() {
  const [popupList, setPopupList] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [products, setProducts] = useState([]);

  const fetchAllPopups = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl("/api/admin/popup"));
      setPopupList(response.data || []);
    } catch (error) {
      console.log("Error fetching popups:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(getApiUrl("/api/admin/products/all"));
      setProducts(response.data?.data || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchAllPopups();
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (imageLoadingState) {
        window.alert("Please wait until the popup image upload finishes.");
        return;
      }

      if (!formData.productId) {
        window.alert("Please select a product for this popup.");
        return;
      }

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        window.alert("Please enter valid start and end dates.");
        return;
      }

      if (endDate.getTime() <= startDate.getTime()) {
        window.alert("End date must be after start date.");
        return;
      }

      setSaving(true);

      if (editingId) {
        await axios.put(
          getApiUrl(`/api/admin/popup/${editingId}`),
          formData
        );
      } else {
        await axios.post(getApiUrl("/api/admin/popup"), formData);
      }

      setFormData(initialFormData);
      setEditingId(null);
      setImageFile(null);
      await fetchAllPopups();
      window.alert(
        editingId ? "Popup updated successfully." : "Popup created successfully."
      );
    } catch (error) {
      console.log("Error saving popup:", error);
      window.alert(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save popup."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (popup) => {
    setEditingId(popup._id);
    setFormData({
      title: popup.title || "",
      description: popup.description || "",
      imageUrl: popup.imageUrl || "",
      productId: popup.productId || "",
      buttonText: popup.buttonText || "Shop Now",
      buttonLink: popup.buttonLink || "/",
      isActive: popup.isActive || false,
      startDate: formatDateTimeLocal(popup.startDate),
      endDate: formatDateTimeLocal(popup.endDate),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this popup?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(getApiUrl(`/api/admin/popup/${id}`));
      fetchAllPopups();
    } catch (error) {
      console.log("Error deleting popup:", error);
    }
  };

  return (
    <div className="space-y-6 p-0 sm:p-6">
      <PopupForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        editingId={editingId}
        setEditingId={setEditingId}
        imageFile={imageFile}
        setImageFile={setImageFile}
        imageLoadingState={imageLoadingState}
        setImageLoadingState={setImageLoadingState}
        saving={saving}
        products={products}
      />

      <div className="rounded-lg bg-white p-4 shadow sm:p-6">
        <h2 className="text-xl font-semibold mb-4">All Popups</h2>

        {loading ? (
          <p>Loading popups...</p>
        ) : popupList.length === 0 ? (
          <p>No popups found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-3 text-left">Title</th>
                  <th className="border p-3 text-left">Description</th>
                  <th className="border p-3 text-left">Status</th>
                  <th className="border p-3 text-left">Start Date</th>
                  <th className="border p-3 text-left">End Date</th>
                  <th className="border p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {popupList.map((popup) => (
                  <tr key={popup._id}>
                    <td className="border p-3">{popup.title}</td>
                    <td className="border p-3">{popup.description}</td>
                    <td className="border p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          popup.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {popup.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="border p-3">
                      {new Date(popup.startDate).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      {new Date(popup.endDate).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(popup)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(popup._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PopupPage;
