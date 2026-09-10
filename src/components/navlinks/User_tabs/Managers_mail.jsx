import { useState, useEffect } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { getManagers } from "../../../api_contents/api";

export default function Managers_mail() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [totalManagers, setTotalManagers] = useState(0);
  const totalPages = Math.ceil(totalManagers / PAGE_SIZE);

  const handleEdit = (user) => {
    console.log("Edit:", user);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  useEffect(() => {
  const fetchManagers = async () => {
    try {
      setLoading(true);

      const data = await getManagers({
        page: currentPage,
        limit: PAGE_SIZE,
        search,
        sortType: "automatic",
        status: "all",
      });

      console.log("API Response:", data);

      setManagers(data.data.admins);
      setTotalManagers(data.data.adminsCount);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchManagers();
}, [currentPage, search]);

  return (
  <div>
    {/* Search */}
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />

      <input
        type="text"
        placeholder="ابحث..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    {/* Table */}
    <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">اسم المستخدم</th>
              <th className="px-4 py-3">رقم الجوال</th>
              <th className="px-4 py-3">البريد الإلكتروني</th>
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
            ) : managers.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-500">
                  لا توجد بيانات
                </td>
              </tr>
            ) : (
              managers.map((manager, index) => (
                <tr
                  key={manager.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>

                  <td className="px-4 py-3">
                    {`${manager.user?.first_name ?? ""} ${
                      manager.user?.last_name ?? ""
                    }`.trim() || "—"}
                  </td>

                  <td className="px-4 py-3">
                    {manager.user?.phone ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    {manager.user?.email ?? "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(manager)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Pencil size={20} />
                      </button>

                      <button
                        onClick={() => handleDelete(manager.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 p-4 border-t">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            السابق
          </button>

          <span className="font-medium">
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