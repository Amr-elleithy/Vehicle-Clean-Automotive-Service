import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { order } from "../../../api_contents/api";

export default function Reservations() {
  const PAGE_WINDOW = 5;
  const PAGE_SIZE = 10;
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);
  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await order({
        page: currentPage,
        limit: PAGE_SIZE,
        search,
        sortType,
        status,
      });

      setOrders(data.data.orders);
      setTotalPages(Math.ceil(data.data.ordersCount / PAGE_SIZE));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, sortType, status]);

  useEffect(() => {
    console.log("Current page:", currentPage);
  }, [currentPage]);

  return (
    <div>
      {/* Filters */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center gap-4 min-w-max">
          {/* Search */}
          <div className="relative w-72 shrink-0">
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
            <option value="descending">تنازلي</option>
            <option value="ascending">تصاعدي</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-72 shrink-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">الكل</option>
            <option value="CREATED">لم تبدأ</option>
            <option value="on-way">في الطريق إلى العميل</option>
            <option value="arrived">تم الوصول للعميل</option>
            <option value="ASSIGNED">بدأت العمل</option>
            <option value="COMPLETED">الطلب مكتمل</option>
            <option value="CANCELLED">الطلب ملغي</option>
          </select>
        </div>
      </div>

      <div className="mt-1 text-xs text-gray-500 text-center animate-pulse md:hidden">
        ← اسحب أفقياً لرؤية المزيد →
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">رقم الحجز</th>
                <th className="px-4 py-3">اسم العميل</th>
                <th className="px-4 py-3">تليفون العميل</th>
                <th className="px-4 py-3">تاريخ الحجز</th>
                <th className="px-4 py-3">التوقيت</th>
                <th className="px-4 py-3">اسم البايكر</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center">
                    ...Loading
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                orders.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="px-4 py-3">{item.number}</td>

                    <td className="px-4 py-3">
                      {item.customer?.user?.first_name || "-"}
                    </td>

                    <td className="px-4 py-3">{item.customer?.user?.phone}</td>

                    <td className="px-4 py-3">{item.order_date}</td>

                    <td className="px-4 py-3">{item.slot?.name}</td>

                    <td className="px-4 py-3">
                      {item.biker?.user?.first_name || "-"}
                    </td>

                    <td className="px-4 py-3">{item.status}</td>

                    <td className="px-4 py-3">Actions</td>
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
    </div>
  );
}
