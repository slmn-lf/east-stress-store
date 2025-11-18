import { getProducts } from "../../actions/product-list";
import { getAllPreOrders, getPreOrderStats } from "../../actions/preorder";

export default async function DashboardPage() {
  const [products, preOrderRes, statsRes] = await Promise.all([
    getProducts(),
    getAllPreOrders(),
    getPreOrderStats(),
  ]);

  const totalProducts = products.length;
  const totalPreOrders =
    statsRes.success && statsRes.data ? statsRes.data.totalOrders : 0;
  const totalQuantity =
    statsRes.success && statsRes.data ? statsRes.data.totalQuantity : 0;

  const recentPreOrders =
    preOrderRes.success && Array.isArray(preOrderRes.data)
      ? (preOrderRes.data as unknown[]).slice(0, 6)
      : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm font-medium">Total Pre-orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalPreOrders}
          </p>
          <p className="text-gray-500 text-sm mt-2">Total orders placed</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-medium">Total Quantity</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalQuantity}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Sum of ordered quantities
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
          <p className="text-gray-600 text-sm font-medium">Total Products</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalProducts}
          </p>
          <p className="text-gray-500 text-sm mt-2">Active products</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm font-medium">Recent Pre-orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {recentPreOrders.length}
          </p>
          <p className="text-gray-500 text-sm mt-2">Latest submissions</p>
        </div>
      </div>

      {/* Recent Pre-orders */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Pre-orders
        </h2>

        {recentPreOrders.length === 0 ? (
          <p className="text-gray-600">No recent pre-orders</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPreOrders.map((p: any) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.productName || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {p.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleString()}
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
