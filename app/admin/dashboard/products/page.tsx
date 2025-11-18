"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Power } from "lucide-react";
import { getProducts, deleteProduct } from "@/app/actions/product-list";
import { toggleProductStatus } from "@/app/actions/product-status";
import { AlertBox } from "@/app/components/AlertBox";
import { Share2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  images?: string[];
  totalPreOrder: number;
  status: string;
  createdAt: Date;
  validUntil: Date | null;
}

interface AlertState {
  isOpen: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  productIdToDelete?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const [alertState, setAlertState] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(
        data.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? null,
          images: p.images ?? [],
          price: p.price,
          totalPreOrder: p.totalPreOrder,
          status: p.status,
          createdAt: new Date(p.createdAt),
          validUntil: p.validUntil ? new Date(p.validUntil) : null,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to load products",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async (id: string) => {
    setDeleting(id);
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts(products.filter((p) => p.id !== id));
        setAlertState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Product deleted successfully",
        });
      } else {
        setAlertState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: `Failed to delete product: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to delete product",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleDelete = (id: string) => {
    setAlertState({
      isOpen: true,
      type: "warning",
      title: "Delete Product",
      message:
        "Are you sure you want to delete this product? This action cannot be undone.",
      productIdToDelete: id,
    });
  };

  const handleToggleStatus = async (id: string) => {
    setToggling(id);
    try {
      const product = products.find((p) => p.id === id);
      const newStatus = product?.status === "active" ? "inactive" : "active";

      const result = await toggleProductStatus(id, newStatus);
      if (result.success) {
        setProducts(
          products.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
        setAlertState({
          isOpen: true,
          type: "success",
          title: "Success",
          message: `Product ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
        });
      } else {
        setAlertState({
          isOpen: true,
          type: "error",
          title: "Error",
          message: `Failed to toggle product status: ${result.error}`,
        });
      }
    } catch (error) {
      console.error("Toggle status error:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to toggle product status",
      });
    } finally {
      setToggling(null);
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const copyLink = async (id: string) => {
    try {
      const link = `${window.location.origin}/products/${id}`;
      await navigator.clipboard.writeText(link);
      setAlertState({
        isOpen: true,
        type: "success",
        title: "Link Disalin",
        message: "Link produk berhasil disalin ke clipboard",
      });
    } catch (error) {
      console.error("Copy link failed:", error);
      setAlertState({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Gagal menyalin link",
      });
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your store products</p>
        </div>
        <Link
          href="/admin/dashboard/products/create"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
          <Plus size={20} />
          Add Product
        </Link>
      </div>

      {/* Stats - Desktop Only */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Active Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {products.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Pre-Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {products.reduce((sum, p) => sum + p.totalPreOrder, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatPrice(
              products.reduce((sum, p) => sum + p.price * p.totalPreOrder, 0)
            )}
          </p>
        </div>
      </div>

      {/* Table - Desktop Only */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {loading ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : (
          <>
            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Total Pre-Order
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Valid Until
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.totalPreOrder}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(product.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            product.status
                          )}`}
                        >
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(product.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(product.validUntil)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/dashboard/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center w-8 h-8 text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(product.id)}
                            disabled={toggling === product.id}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded transition ${
                              product.status === "active"
                                ? "text-yellow-600 hover:bg-yellow-50"
                                : "text-green-600 hover:bg-green-50"
                            } disabled:opacity-50`}
                            title={
                              product.status === "active"
                                ? "Deactivate"
                                : "Activate"
                            }
                          >
                            <Power size={18} />
                          </button>
                          <button
                            onClick={() => copyLink(product.id)}
                            className="inline-flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-gray-50 rounded transition"
                            title="Salin link"
                          >
                            <Share2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {products.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Cards Layout - Mobile Only */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">No products found</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              {/* Header Card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status.charAt(0).toUpperCase() +
                      product.status.slice(1)}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-900 font-semibold rounded-full text-sm">
                  {product.totalPreOrder}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">PRICE</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    CREATED AT
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
                {product.validUntil && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      VALID UNTIL
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(product.validUntil)}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/admin/dashboard/products/${product.id}/edit`}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleStatus(product.id)}
                  disabled={toggling === product.id}
                  className={`flex-1 px-3 py-2 font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 ${
                    product.status === "active"
                      ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                      : "bg-green-50 text-green-600 hover:bg-green-100"
                  }`}
                >
                  <Power size={16} />
                  {product.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
                <button
                  onClick={() => copyLink(product.id)}
                  className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* capture/preview removed - share is now copy-link only */}

      {/* Summary - Desktop Only */}
      {!loading && (
        <div className="hidden md:block mt-4 text-sm text-gray-600">
          Showing <span className="font-medium">{products.length}</span>{" "}
          products
        </div>
      )}

      {/* Alert Box */}
      <AlertBox
        isOpen={alertState.isOpen}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
        onConfirm={
          alertState.productIdToDelete
            ? () => {
                handleDeleteConfirm(alertState.productIdToDelete!);
                setAlertState({ ...alertState, isOpen: false });
              }
            : undefined
        }
        showConfirm={!!alertState.productIdToDelete}
        confirmText="Delete"
      />
    </div>
  );
}
