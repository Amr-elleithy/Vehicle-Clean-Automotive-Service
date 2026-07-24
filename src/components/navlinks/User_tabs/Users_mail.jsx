import { Search, Pencil, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { getClients } from "../../../api_contents/api";

export default function Users_mail() {
  const PAGE_SIZE = 10;
  const PAGE_WINDOW = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalUsers / PAGE_SIZE));
  const startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);
  const pages = [];

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const data = await getClients({
          page: currentPage,
          limit: PAGE_SIZE,
          search,
          sortType: "automatic",
          status: "all",
        });

        setUsers(data.data.clients);
        setTotalUsers(data.data.clientsCount);
        console.log("API Response:", data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, search]);

  const handleEdit = (user) => {
    console.log("Edit:", user);
  };

  const handleDelete = (id) => {
    console.log("Delete:", id);
  };

  return (
    <div>
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
      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">اسم المستخدم</th>
                <th className="px-4 py-3">رقم الجوال</th>
                <th className="px-4 py-3">البريد الالكتروني</th>
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
              ) : users.length > 0 ? (
                users.map((client, index) => (
                  <tr key={client.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>

                    <td className="px-4 py-3">
                      {client.user?.first_name || "-"}{" "}
                      {client.user?.last_name || ""}
                    </td>

                    <td className="px-4 py-3">{client.user?.phone || "-"}</td>

                    <td className="px-4 py-3">{client.user?.email || "-"}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(client)}>
                          <Pencil
                            size={18}
                            className="text-blue-600 hover:text-blue-800"
                          />
                        </button>

                        <button onClick={() => handleDelete(client.id)}>
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
                  <td colSpan={5} className="py-10 text-center text-gray-500">
                    لا توجد بيانات
                  </td>
                </tr>
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
