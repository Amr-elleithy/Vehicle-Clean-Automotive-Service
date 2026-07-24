import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { points } from "../../../api_contents/api";

export default function Users_points() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [usersPoints, setUsersPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchPoints = async () => {
    try {
      setLoading(true);

      const res = await points(currentPage, PAGE_SIZE, search, sortType, status);

      setUsersPoints(res.data?.points ?? res.data ?? []);

      if (res.meta?.total) {
        setTotalPages(Math.max(1, Math.ceil(res.meta.total / PAGE_SIZE)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("ERROR:", err);
      setUsersPoints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [currentPage, search, sortType, status]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="relative w-[70%]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ابحث..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          value={sortType}
          onChange={(e) => {
            setCurrentPage(1);
            setSortType(e.target.value);
          }}
          className="w-[30%] rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="automatic">تلقائي</option>
          <option value="asc">تصاعدي (الأقدم إلى الأحدث)</option>
          <option value="desc">تنازلي (الأحدث إلى الأقدم)</option>
        </select>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">اسم المستخدم</th>
                <th className="px-4 py-3">رقم الجوال</th>
                <th className="px-4 py-3">النقاط</th>
                <th className="px-4 py-3">نوع الغسلة</th>
                <th className="px-4 py-3">تاريخ اخر غسلة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : usersPoints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                usersPoints.map((row, index) => (
                  <tr key={row.id ?? index} className="border-t">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">{row.user?.name}</td>
                    <td className="px-4 py-3" dir="ltr">
                      {row.user?.phone}
                    </td>
                    <td className="px-4 py-3">{row.user?.total_points}</td>
                    <td className="px-4 py-3">{row.package?.name ?? "-"}</td>
                    <td className="px-4 py-3">
                      {row.created_at
                        ? new Date(row.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 p-4 border-t">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            السابق
          </button>

          <span>
            صفحة {currentPage} من {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}