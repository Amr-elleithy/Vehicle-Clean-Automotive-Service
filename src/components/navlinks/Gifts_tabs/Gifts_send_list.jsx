import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import { display_gifts } from "../../../api_contents/api";
import { baqu } from "../../../api_contents/api";

export default function Gifts_send_list() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchGifts = async () => {
    try {
      setLoading(true);

      const res = await display_gifts(
        currentPage,
        PAGE_SIZE,
        search,
        sortType,
        status,
      );

      setGifts(res.data.gifts);

      if (res.meta?.total) {
        setTotalPages(Math.max(1, Math.ceil(res.meta.total / PAGE_SIZE)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("ERROR:", err);
      setGifts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const res = await baqu({
        page: 1,
        limit: 100,
        search: "",
        sortType: "automatic",
        status: "all",
      });
      setPackages(res.data?.packages ?? res.data ?? []);
    } catch (err) {
      console.error("ERROR fetching packages:", err);
      setPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [currentPage, search, sortType, status]);

  const sortedGifts = useMemo(() => {
    if (sortType === "automatic") return gifts;

    const copy = [...gifts];
    copy.sort((a, b) => {
      const dateA = new Date(a.subscription?.created_at ?? 0).getTime();
      const dateB = new Date(b.subscription?.created_at ?? 0).getTime();
      return sortType === "asc" ? dateA - dateB : dateB - dateA;
    });
    return copy;
  }, [gifts, sortType]);

  return (
    <div>
      <div className="flex items-center gap-3">
        <select
          value={selectedPackage}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedPackage(value);
            setCurrentPage(1);
            setStatus(value);
          }}
          disabled={packagesLoading}
          className="w-[30%] rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="all">الكل</option>
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">رقم جوال المرسال </th>
                <th className="px-4 py-3">رقم جوال المرسل اليه </th>
                <th className="px-4 py-3">نوع الهدية</th>
                <th className="px-4 py-3">نص الرسالة</th>
                <th className="px-4 py-3">تاريخ الارسال</th>
                <th className="px-4 py-3">الخدمات الاضافية</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : sortedGifts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-400">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                sortedGifts.map((gift, index) => (
                  <tr key={gift.id ?? index} className="border-t">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">{gift.sender?.phone}</td>
                    <td className="px-4 py-3">{gift.receiver?.phone}</td>
                    <td className="px-4 py-3">{gift.subscription?.name}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => alert(gift.message)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {gift.subscription?.created_at
                        ? new Date(
                            gift.subscription.created_at,
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      {gift.subscription?.service?.length > 0
                        ? gift.subscription.service
                            .map((service) => service.name)
                            .join("، ")
                        : "لا توجد خدمات إضافية"}
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