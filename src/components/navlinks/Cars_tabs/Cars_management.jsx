import React from "react";
import { useState, useEffect } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { vehicleBrand } from "../../../api_contents/api";

export default function Cars_management() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const PAGE_SIZE = 10;
  const [totalBrands, setTotalBrands] = useState(0);

  const totalPages = Math.ceil(totalBrands / PAGE_SIZE);
  const handleEdit = (brand) => {
    console.log("Edit:", brand);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);

        const data = await vehicleBrand({
          page: currentPage,
          limit: PAGE_SIZE,
          search,
          sortType: "automatic",
          status: "all",
        });

        setBrands(data.data);
        setTotalBrands(data.meta.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [currentPage, search]);

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
                <th className="px-4 py-3">موديل السيارة </th>
                <th className="px-4 py-3"> البراند</th>
                <th className="px-4 py-3">صورة السيارة</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : brands.length > 0 ? (
                brands.map((brand, index) => (
                  <tr key={brand.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="px-4 py-3">{brand.name_ar}</td>

                    <td className="px-4 py-3">{brand.name}</td>

                    <td className="px-4 py-3">
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="w-12 h-12 object-contain mx-auto"
                      />
                    </td>

                    <td className="px-4 py-3">
                      {brand.is_active ? "نشط" : "غير نشط"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(brand)}>
                          <Pencil
                            size={18}
                            className="text-blue-600 hover:text-blue-800"
                          />
                        </button>

                        <button onClick={() => handleDelete(brand.id)}>
                          <Trash2
                            size={18}
                            className="text-red-600 hover:text-red-800"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-500">
                    لا توجد بيانات
                  </td>
                </tr>
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
