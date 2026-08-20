"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, CheckCircle2 } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import NodeApi from "@/utils/NodeApi";
import { toast } from "sonner";

const categoryOptions = [
  { label: "Electronics", value: "electronics" },
  { label: "Fashion & Apparel", value: "fashion" },
  { label: "Home & Kitchen", value: "home_living" },
  { label: "Beauty & Personal Care", value: "beauty" },
  { label: "Sports & Outdoors", value: "sports" },
];

const ProductValidationSchema = Yup.object({
  productName: Yup.string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .required("Product name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  stock: Yup.number()
    .typeError("Stock must be a number")
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock quantity is required"),
  category: Yup.string().required("Please select a category"),
});

export default function CreateUpdateProduct() {
  const [imageError, setImageError] = useState<string>("");
  const [loading, setLoading] = useState(false)
  const path = usePathname()
  const isUpdateProductPage = path.includes('update_product')
  const router = useRouter();
  const params = useParams()
  const slug = params?.slug?.[1] || path.split('/').filter(Boolean).pop()
  const auth = JSON.parse(localStorage.getItem('auth') || "{}")

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      color: [] as string[],
      product_images: [] as any[]
    },
    validationSchema: ProductValidationSchema,
    onSubmit: (values) => {
      if (isUpdateProductPage) {
        UpdateProduct(values)
      } else {
        CreateProduct()
      }
    },
  });

  const UpdateProduct = async (value: any) => {
    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('product_name', value.productName)
      formData.append('price', String(value.price))
      formData.append('stock', String(value.stock))
      formData.append('category', value.category)
      formData.append('description', value.description || '')
      formData.append('store_id', auth?._id)

      value.product_images.forEach((image: any) => {
        if (image instanceof File) {
          formData.append('product_images', image)
        } else if (typeof image === 'string') {
          formData.append('existing_images', image)
        }
      })

      const response = await NodeApi.patch(
        `/product/update_product/${slug}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response?.data?.success) {
        toast.success(response?.data?.msg || 'Product updated successfully')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('error:', error)
      toast.error('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  const CreateProduct = async () => {
    setLoading(true)
    try {
      const formData = new FormData()

      formData.append('product_name', formik?.values?.productName)
      formData.append('price', String(formik?.values?.price || ''))
      formData.append('stock', String(formik?.values?.stock || ''))
      formData.append('description', formik?.values?.description || '')
      formData.append('category', formik?.values?.category)
      formData.append('store_id', auth?._id)

      formik?.values?.product_images.forEach((image) => {
        formData.append('product_images', image)
      })
      const response = await NodeApi.post(
        "/product/create_product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.msg || 'Product create successfully')
        // formik.resetForm()
        router.push('/dashboard')
      }
    } catch (error) {
      console.error("Error : ", error)
      toast.error('Something wrong!')
    }
    finally {
      setLoading(false)
    }
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);

    const updatedImages = [
      ...formik.values.product_images,
      ...files,
    ];

    if (updatedImages.length > 10) {
      setImageError("Maximum 10 images are allowed.");
      return;
    }

    setImageError("");
    formik.setFieldValue("product_images", updatedImages);
  };

  const removeImage = (index: number) => {
    const images = [...formik.values.product_images];
    images.splice(index, 1);

    formik.setFieldValue("product_images", images);
  };

  const getImagePreviewUrl = (image: string | File) => {
    if (typeof image === "string") {
      return image;
    }

    return URL.createObjectURL(image);
  };

  const GetSingleProduct = async () => {
    try {
      const response = await NodeApi.get(`/product/get_product/${slug}`)

      formik.setValues({
        productName: response?.data?.product?.product_name,
        price: response?.data?.product?.price,
        stock: response?.data?.product?.stock,
        category: response?.data?.product?.category,
        description: response?.data?.product?.description,
        color: response?.data?.product?.color,
        product_images: response?.data?.product?.product_images || []
      })
    } catch (error) {
      console.error("Error : ", error)
      toast.error("Unable to load product")
    }
  }

  useEffect(() => {
    if (isUpdateProductPage) {
      GetSingleProduct()
    }
  }, [])

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
          {isUpdateProductPage ? 'Update' : 'Create Product'}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {
            isUpdateProductPage ? ' Update item to your catalog with pricing, inventory, and media.' : ' Add a new item to your catalog with pricing, inventory, and media.'
          }
        </p>
      </div>


      {/* Form Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
          <CardDescription>
            {isUpdateProductPage ? 'Update in the details below your product.' : 'Fill in the details below to create your product listing.'}

          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* 1. Product Name */}
            <div>
              <Label htmlFor="productName" required>
                Product Name
              </Label>
              <Input
                id="productName"
                name="productName"
                type="text"
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                value={formik.values.productName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.productName && formik.errors.productName
                    ? formik.errors.productName
                    : undefined
                }
              />
            </div>

            {/* Price & Stock Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 2. Price */}
              <div>
                <Label htmlFor="price" required>
                  Price ($)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.price && formik.errors.price
                      ? formik.errors.price
                      : undefined
                  }
                />
              </div>

              {/* 3. Stock */}
              <div>
                <Label htmlFor="stock" required>
                  Stock Quantity
                </Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  placeholder="e.g. 50"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.stock && formik.errors.stock
                      ? formik.errors.stock
                      : undefined
                  }
                />
              </div>
            </div>

            {/* 4. Category */}
            <div>
              <Label htmlFor="category" required>
                Category
              </Label>
              <Select
                id="category"
                name="category"
                options={categoryOptions}
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.category && formik.errors.category
                    ? formik.errors.category
                    : undefined
                }
              />
            </div>

            {/* 5. Description */}
            <div>
              <Label htmlFor="description">
                Description (Optional)
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Write a clear description highlighting product features, specifications, and warranty info..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.description && formik.errors.description
                    ? formik.errors.description
                    : undefined
                }
              />
            </div>

            {/* 6. Multi Select Image */}
            <div>
              <Label required>Product Images (Multi Select)</Label>
              <div className="mt-1 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-6 text-center hover:border-black dark:hover:border-white transition-colors">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-300">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    Click to upload images
                  </div>
                  <p className="text-xs text-zinc-500">
                    SVG, PNG, JPG or WEBP (Select multiple files)
                  </p>
                </label>
              </div>

              {imageError && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {imageError}
                </p>
              )}

              {/* Selected Images List Preview */}
              {formik.values.product_images.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Selected Images ({formik.values.product_images.length}/10)
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {formik.values.product_images.map((file, index) => {
                      const previewUrl = getImagePreviewUrl(file);
                      const fileName = typeof file === "string"
                        ? file.split("/").pop() || "Product image"
                        : file.name;

                      return (
                        <div
                          key={index}
                          className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800"
                        >
                          <img
                            src={previewUrl}
                            alt={fileName}
                            className="w-full h-32 object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1 hov?er:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <p className="p-2 text-xs truncate text-center">
                            {fileName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: 7. Cancel Button & 8. Create Button */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button disabled={loading} loading={loading} type="submit" variant="primary">
                {isUpdateProductPage ? 'Update' : 'Create Product'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
