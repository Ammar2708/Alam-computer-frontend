import React, { useEffect, useState } from "react";
import { Plus, Cpu } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import CommonForm from "@/components/comman/Form";
import { addProductFormElement } from "@/config";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ProductImageUpload from "@/components/admin-view/dummy/Image-upload";
import AdminProductTile from "@/components/admin-view/dummy/ProductTile";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewProduct,
  editProduct,
  fetchAllProducts,
  deleteProduct, // 1. Added deleteProduct to imports
} from "@/store/admin/product-slice/Index";
import { toast } from "sonner";

const initialFormData = {
  image: "",
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
};

const getProductImages = (product) => {
  if (Array.isArray(product?.images) && product.images.length > 0) {
    return product.images.filter(Boolean);
  }

  return product?.image ? [product.image] : [];
};

const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  // 2. CREATED THE DELETE FUNCTION
  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast.success("Hardware removed from inventory");
      } else {
        toast.error("Failed to delete product");
      }
    });
  }

  function resetProductForm() {
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setImageFile([]);
    setUploadedImageUrls([]);
    setOpenCreateProductsDialog(false);
  }

  function handleEditProduct(product) {
    const productImages = getProductImages(product);

    setOpenCreateProductsDialog(true);
    setCurrentEditedId(product?._id);
    setFormData({
      ...initialFormData,
      ...product,
      image: productImages[0] || "",
      images: productImages,
    });
    setImageFile([]);
    setUploadedImageUrls(productImages);
  }

  function onSubmit(event) {
    event.preventDefault();

    if (imageLoadingState) {
      toast.error("Please wait for the image to finish uploading");
      return;
    }

    const finalImages = uploadedImageUrls.filter(Boolean);
    const finalImageUrl = finalImages[0];

    if (!finalImageUrl) {
      toast.error("Please upload at least one product image before saving");
      return;
    }

    const productPayload = {
      ...formData,
      image: finalImageUrl,
      images: finalImages,
    };

    const action = currentEditedId
      ? editProduct({
          id: currentEditedId,
          formData: productPayload,
        })
      : addNewProduct(productPayload);

    dispatch(action).then((data) => {
      if (data?.payload?.success) {
        resetProductForm();
        dispatch(fetchAllProducts());
        toast.success(data.payload.message || (currentEditedId ? "Product updated" : "Product added"));
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <div className="min-h-screen w-full bg-slate-50/50 p-0 sm:p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
        <Button
          onClick={() => {
            resetProductForm();
            setOpenCreateProductsDialog(true);
          }}
          className="w-full rounded-xl bg-red-600 px-6 py-6 text-white shadow-lg shadow-red-200 transition-all duration-300 hover:-translate-y-1 hover:bg-red-700 active:scale-95 sm:w-auto"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Product
        </Button>
      </div>

      <div className="grid items-stretch gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {productList?.length > 0 ? (
          productList.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              handleEditProduct={handleEditProduct}
              handleDelete={handleDelete} 
            />
          ))
        ) : (
          <div className="col-span-full rounded-3xl border-2 border-dashed border-slate-200 bg-white p-8 text-center sm:p-20">
            <Plus className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-500">No products found in stock.</p>
          </div>
        )}
      </div>

      <Sheet open={openCreateProductsDialog} onOpenChange={setOpenCreateProductsDialog}>
        <SheetContent side="right" className="w-full overflow-auto border-l border-slate-200 bg-white px-0 sm:max-w-md">
          {/* ... Sheet Content Remains the Same ... */}
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <SheetTitle>{currentEditedId ? "Edit Product" : "New Entry"}</SheetTitle>
                  <SheetDescription>Update your computer store stock.</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <div className="px-6 py-8 space-y-8">
               <ProductImageUpload
                  imageFile={imageFile}
                  setImageFile={setImageFile}
                  imageLoadingState={imageLoadingState}
                  uploadedImageUrls={uploadedImageUrls}
                  setUploadedImageUrls={setUploadedImageUrls}
                  setImageLoadingState={setImageLoadingState}
                  isEditMode={Boolean(currentEditedId)}
                  isCustomStyling
                  multiple
                  maxImages={6}
                  createText="Upload Product Images"
                  replaceText="Add / Replace Product Images"
                  tipText="Upload up to 6 images. The first image becomes the main product photo."
                />
                <CommonForm
                  formControls={addProductFormElement}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={onSubmit}
                  buttonText={currentEditedId ? "Update Product" : "List Product"}
                  // Styles passed from your previous professional design
                  buttonClassName="w-full h-12 rounded-xl bg-red-600 text-white font-bold transition-all hover:bg-red-700"
                />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminProducts;
