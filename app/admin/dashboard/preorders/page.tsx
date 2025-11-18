"use client";

import { useEffect, useState } from "react";
import {
  getAllPreOrders,
  deletePreOrder,
  PreOrderWithProduct,
} from "@/app/actions/preorder";
import { Trash2, Eye } from "lucide-react";

export default function PreOrderListPage() {
  const [preOrders, setPreOrders] = useState<PreOrderWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewDetail, setViewDetail] = useState<PreOrderWithProduct | null>(
    null
  );

  // Fetch pre-orders
  useEffect(() => {
    const fetchPreOrders = async () => {
      setLoading(true);
      setError("");
      const result = await getAllPreOrders();
      if (result.success && result.data) {
        setPreOrders(result.data);
      } else {
        setError(result.error || "Gagal mengambil data pre-order");
      }
      setLoading(false);
    };

    fetchPreOrders();
  }, []);

  // Handle delete
  const handleDelete = async (id: string) => {
    const result = await deletePreOrder(id);
    if (result.success) {
      setPreOrders(preOrders.filter((order) => order.id !== id));
      setDeleteConfirm(null);
    } else {
      setError(result.error || "Gagal menghapus pre-order");
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render a compact summary of custom fields for table rows
  const summarizeCustomFields = (order: PreOrderWithProduct) => {
    if (!order.customFields) return "-";
    try {
      const fields = JSON.parse(order.customFields);
      const parts: string[] = Object.entries(fields).map(([key, value]) => {
        let label = key.replace(/_/g, " ");
        if (key.startsWith("field_")) {
          const id = key.replace(/^field_/, "");
          const found = order.productAdditionalFields?.find((f) => f.id === id);
          if (found?.label) label = found.label;
          else label = id;
        }
        const display =
          typeof value === "object" ? JSON.stringify(value) : String(value);
        return `${label}: ${display}`;
      });

      // show up to two fields in table summary
      return parts.slice(0, 2).join(", ");
    } catch {
      return String(order.customFields);
    }
  };

  // Extract the 'Ukuran' (size) field value from order.customFields
  const getSizeFromOrder = (order: PreOrderWithProduct) => {
    if (!order.customFields) return null;
    try {
      const fields = JSON.parse(order.customFields);

      // First try to find a product additional field whose label indicates size
      const sizeFieldDef = order.productAdditionalFields?.find(
        (f) =>
          f.label?.toLowerCase().includes("ukuran") ||
          f.label?.toLowerCase().includes("size")
      );

      if (sizeFieldDef) {
        const key = `field_${sizeFieldDef.id}`;
        if (fields[key] !== undefined) return String(fields[key]);
      }

      // Fallback: try to find any key that contains 'ukuran' or 'size'
      for (const [k, v] of Object.entries(fields)) {
        if (
          k.toLowerCase().includes("ukuran") ||
          k.toLowerCase().includes("size")
        ) {
          return typeof v === "object" ? JSON.stringify(v) : String(v);
        }
      }

      return null;
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Memuat data pre-order...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List Pre-Order</h1>
        <p className="text-gray-600 mt-2">
          Kelola dan lihat semua pre-order dari pelanggan
        </p>
      </div>

      {/* Stats - Desktop Only */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Pre-Order</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {preOrders.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Kuantitas</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {preOrders.reduce((sum, order) => sum + order.quantity, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">
            Jumlah Produk Unik
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {new Set(preOrders.map((order) => order.productId)).size}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table - Desktop Only */}
      <div className="bg-white rounded-lg shadow overflow-hidden hidden md:block">
        {preOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">Belum ada pre-order</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                    Nama Pelanggan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                    Produk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                    Telepon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                    Ukuran
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {preOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{order.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{order.productName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {order.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">
                        {getSizeFromOrder(order) ?? "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewDetail(order)}
                          className="inline-flex items-center justify-center px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition"
                          title="Lihat detail"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(order.id)}
                          className="inline-flex items-center justify-center px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
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

      {/* Cards Layout - Mobile Only */}
      <div className="md:hidden space-y-4">
        {preOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            <p className="text-lg">Belum ada pre-order</p>
          </div>
        ) : (
          preOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-4">
              {/* Header Card */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{order.name}</p>
                  <p className="text-sm text-gray-600">{order.productName}</p>
                </div>
                <span className="inline-flex items-center justify-center w-10 h-8 bg-blue-100 text-blue-900 font-semibold rounded-full text-sm">
                  {getSizeFromOrder(order) ?? "-"}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div>
                  <p className="text-xs text-gray-500 font-semibold">TELEPON</p>
                  <a
                    href={`https://wa.me/${order.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {order.phone}
                  </a>
                </div>

                {order.email && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">EMAIL</p>
                    <p className="text-sm text-gray-900">{order.email}</p>
                  </div>
                )}
                {order.address && (
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">
                      ALAMAT
                    </p>
                    <p className="text-sm text-gray-900">{order.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 font-semibold">
                    TANGGAL PESAN
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewDetail(order)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  Detail
                </button>
                <button
                  onClick={() => setDeleteConfirm(order.id)}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {viewDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Detail Pre-Order
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama</p>
                <p className="font-semibold text-gray-900">{viewDetail.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Produk</p>
                <p className="font-semibold text-gray-900">
                  {viewDetail.productName || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor Telepon</p>
                <p className="font-semibold text-gray-900">
                  {viewDetail.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">
                  {viewDetail.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Alamat</p>
                <p className="font-semibold text-gray-900">
                  {viewDetail.address}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jumlah</p>
                <p className="font-semibold text-gray-900">
                  {viewDetail.quantity}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal</p>
                <p className="font-semibold text-gray-900">
                  {formatDate(viewDetail.createdAt)}
                </p>
              </div>
              {viewDetail.customFields && (
                <>
                  <hr className="my-4" />
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Field Tambahan
                  </h4>
                  {(() => {
                    try {
                      const fields = JSON.parse(viewDetail.customFields);
                      return (
                        <div className="space-y-3">
                          {Object.entries(fields).map(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ([key, value]: [string, any]) => {
                              // If saved keys are in the form `field_<id>`, try to
                              // resolve a friendly label from the product's
                              // additional field definitions. Fallback to a
                              // cleaned-up key when label not available.
                              let label = key.replace(/_/g, " ");
                              if (key.startsWith("field_")) {
                                const id = key.replace(/^field_/, "");
                                const found =
                                  viewDetail.productAdditionalFields?.find(
                                    (f) => f.id === id
                                  );
                                if (found?.label) label = found.label;
                                else label = id;
                              }

                              return (
                                <div key={key}>
                                  <p className="text-sm text-gray-600 capitalize">
                                    {label}
                                  </p>
                                  <p className="font-semibold text-gray-900">
                                    {typeof value === "object"
                                      ? JSON.stringify(value)
                                      : String(value)}
                                  </p>
                                </div>
                              );
                            }
                          )}
                        </div>
                      );
                    } catch {
                      return (
                        <p className="text-sm text-gray-600">
                          {viewDetail.customFields}
                        </p>
                      );
                    }
                  })()}
                </>
              )}
            </div>
            <button
              onClick={() => setViewDetail(null)}
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Hapus Pre-Order?
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus pre-order ini? Tindakan ini
              tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-900 font-medium rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
