import React, { useState, useEffect } from "react";
import { Search, FileText } from "lucide-react";
import { getUserBills } from "../../api_contents/api";
import { downloadInvoice } from "../../api_contents/api";

export default function Invoice() {
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInvoiceClick = async (bill) => {
    try {
      const res = await downloadInvoice(bill.id);

      console.log(res);

      if (res.statusCode === 200 && typeof res.data === "string") {
        window.open(res.data, "_blank");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchBills = async () => {
    try {
      setLoading(true);

      const res = await getUserBills({
        page: currentPage,
        limit: PAGE_SIZE,
        search,
        sortType,
        status,
      });
      console.log(res);
      console.log(res.data);
      console.log(typeof res.data);

      setBills(res.data?.invoices ?? res.data ?? []);

      if (res.meta?.total) {
        setTotalPages(Math.max(1, Math.ceil(res.meta.total / PAGE_SIZE)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("ERROR:", err);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = (bill) => {
    console.log("Invoice clicked:", bill);

    // window.open(bill.receipt_url, "_blank");
  };

  useEffect(() => {
    fetchBills();
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
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">رقم الفاتورة</th>
                <th className="px-4 py-3">رقم الدفع</th>
                <th className="px-4 py-3">اسم العميل</th>
                <th className="px-4 py-3">رقم الجوال</th>
                <th className="px-4 py-3">نسبة الضريبة</th>
                <th className="px-4 py-3">المجموع الفرعي</th>
                <th className="px-4 py-3">المجموع النهائي</th>
                <th className="px-4 py-3">الفاتورة</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-500">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                bills.map((bill, index) => (
                  <tr key={bill.id ?? index} className="border-t">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">{bill.invoice_number}</td>
                    <td className="px-4 py-3">{bill.payment_id}</td>
                    <td className="px-4 py-3">
                      {bill.customer?.user?.first_name}
                    </td>
                    <td className="px-4 py-3" dir="ltr">
                      {bill.customer?.user?.phone}
                    </td>
                    <td className="px-4 py-3">{bill.vat}%</td>
                    <td className="px-4 py-3">{bill.total_price}</td>
                    <td className="px-4 py-3">{bill.total_price_net}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleOpenReceipt(bill)}
                        className="text-blue-600 hover:text-blue-800"
                        title="عرض الفاتورة"
                      >
                        <FileText
                          size={18}
                          className="text-blue-600 cursor-pointer hover:text-blue-800"
                          onClick={() => handleInvoiceClick(bill)}
                        />
                      </button>
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
