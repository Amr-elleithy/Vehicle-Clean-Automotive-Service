import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { bikers_points } from "../../../api_contents/api";

export default function Bikers_points() {
  const PAGE_SIZE = 10;
  const [bikers, setBikers] = useState([]);
  const [rawResponse, setRawResponse] = useState(null); // 👈 debug holder
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await bikers_points(
          currentPage,
          PAGE_SIZE,
          search,
          sortType,
          status,
        );
        console.log("API response:", data);

        // shape is: { message, data: { bikers: [...], bikersCount }, statusCode }
        setBikers(data?.data?.bikers ?? []);
      } catch (err) {
        console.error(err);
        setBikers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث..."
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="w-[30%] rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="automatic">تلقائي</option>
          <option value="ascending">تصاعدي</option>
        </select>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">اسم البايكر</th>
                <th className="px-4 py-3">رقم الجوال </th>
                <th className="px-4 py-3">اخر النقاط المكتسبة</th>
                <th className="px-4 py-3">نوع الغسلة</th>
                <th className="px-4 py-3">تاريخ اخر غسلة</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              )}

              {!loading &&
                bikers.length > 0 &&
                bikers.map((biker, index) => (
                  <tr key={biker.id ?? index} className="border-t">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {biker.user?.first_name} {biker.user?.last_name}
                    </td>
                    <td className="px-4 py-3">{biker.user?.phone}</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3">—</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                ))}

              {/* Empty state */}
              {!loading && bikers.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-500">
                    {" "}
                    لا توجد بيانات
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
