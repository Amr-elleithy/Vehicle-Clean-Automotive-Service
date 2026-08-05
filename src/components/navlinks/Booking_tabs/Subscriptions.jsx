import React, { useState, useEffect, useCallback} from "react";
import { Search } from "lucide-react";
import { Subscription } from "../../../api_contents/api";

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Subscriptions() {
  const PAGE_WINDOW = 5;
  const PAGE_SIZE = 10;
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [serviceType, setServiceType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const json = await Subscription({
        page: currentPage,
        limit: PAGE_SIZE,
        all_orders: true,
        with_order: false,
        with_expired: true,
        sort: sortType,
        search: search || undefined,
      });
      console.log(json.data);
      if (json.statusCode && json.statusCode !== 200) {
        throw new Error(json.message || "حدث خطأ ما");
      }
      setSubscriptions(json.data?.subscriptions ?? []);
      setTotalPages(Math.ceil((json.data?.subscriptionCount ?? 0) / PAGE_SIZE));
    } catch (err) {
      if (err.response?.status === 401) {
        setError("انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى");
      } else if (err.response) {
        setError(
          err.response.data?.message || `فشل الطلب برمز ${err.response.status}`,
        );
      } else {
        setError(err.message || "خطأ في الشبكة، حاول مرة أخرى");
      }
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortType, search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setCurrentPage(1);
    }, 400);

    return () => clearTimeout(handle);
  }, [search, sortType]);

  useEffect(() => {
    loadSubscriptions();
  }, [currentPage, search, sortType]);

  const startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);
  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div>
      {/* Filters */}
      <div className="overflow-x-auto pb-3 [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-wrap items-center gap-4 ">
          {/* Search */}
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ابحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Sort */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="w-48 shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="automatic">تصاعدي</option>
            <option value="ascending">تنازلي</option>
          </select>

          {/* Package */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-60 shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">عرض الباقات</option>
            <option value="Single Wash">Single Wash</option>
            <option value="Family Package">Family Package</option>
            <option value="White Package">White Package</option>
            <option value="Yellow Package">Yellow Package</option>
            <option value="Gold Package">Gold Package</option>
            <option value="Black Package">Black Package</option>
          </select>

          {/* Status */}
          <select
            value={serviceType}
            onChange={(e) => {
              setServiceType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-40 shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">الكل</option>
            <option value="maintenance">Active</option>
            <option value="cleaning">Deleted</option>
            <option value="delivery">Empty</option>
            <option value="expired">Expired</option>
            <option value="gift">Gift</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>
      </div>

      <div className="mt-1 text-xs text-center text-gray-500 md:hidden">
        ← اسحب أفقياً لرؤية المزيد →
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-right">
          {error}
        </div>
      )}

      <div className="mt-6 overflow-x-auto [&::-webkit-scrollbar]:h-3 [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">رقم الفاتورة</th>
              <th className="px-4 py-3">اسم العميل</th>
              <th className="px-4 py-3">تليفون العميل</th>
              <th className="px-4 py-3">الباقة </th>
              <th className="px-4 py-3">تاريخ الاشتراك</th>
              <th className="px-4 py-3">تاريخ انتهاء الباقة </th>
              <th className="px-4 py-3">رصيد الباقة</th>
              <th className="px-4 py-3">المتبقي</th>
              <th className="px-4 py-3">حالة الأشتراك</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-gray-500">
                  جاري التحميل...
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-10 text-center text-gray-500">
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              subscriptions.map((sub, index) => (
                <tr
                  key={sub.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    {sub.order_invoice?.invoice_number ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {`${sub.customer?.user?.first_name ?? ""} ${
                      sub.customer?.user?.last_name ?? ""
                    }`.trim() || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {sub.customer?.user?.phone ?? "—"}
                  </td>
                  <td className="px-4 py-3">{sub.name ?? "—"}</td>
                  <td className="px-4 py-3">{formatDate(sub.created_at)}</td>
                  <td className="px-4 py-3">{formatDate(sub.expiry_date)}</td>
                  <td className="px-4 py-3">{sub.total_was_count}</td>
                  <td className="px-4 py-3">{sub.wash_count}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium
              ${
                sub.status?.toLowerCase() === "active"
                  ? "bg-green-100 text-green-700"
                  : sub.status?.toLowerCase() === "deleted"
                    ? "bg-red-100 text-red-700"
                    : sub.status?.toLowerCase() === "empty"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
              }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 p-4 border-t flex-wrap">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          السابق
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => setCurrentPage(1)}
              className="w-9 h-9 rounded border hover:bg-gray-100"
            >
              1
            </button>
            {startPage > 2 && <span>...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-9 h-9 rounded ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span>...</span>}
            <button
              onClick={() => setCurrentPage(totalPages)}
              className="w-9 h-9 rounded border hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          التالي
        </button>
      </div>
    </div>
  );
}
