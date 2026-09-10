import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { getUserBills } from "../../api_contents/api";
import { downloadInvoice } from "../../api_contents/api";

export default function Invoice() {
 const PAGE_SIZE = 10;
const PAGE_WINDOW = 5;

const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const [search, setSearch] = useState("");
const [searchInput, setSearchInput] = useState("");
const [sortType, setSortType] = useState("automatic");
const [status, setStatus] = useState("all");

const [bills, setBills] = useState([]);
const [loading, setLoading] = useState(false);

// Pagination calculations
const startPage = Math.max(
  1,
  currentPage - Math.floor(PAGE_WINDOW / 2)
);

const endPage = Math.min(
  totalPages,
  startPage + PAGE_WINDOW - 1
);

const adjustedStartPage = Math.max(
  1,
  endPage - PAGE_WINDOW + 1
);

const pages = Array.from(
  { length: endPage - adjustedStartPage + 1 },
  (_, i) => adjustedStartPage + i
);

const handleInvoiceClick = async (bill) => {
  try {
    const res = await downloadInvoice(bill.id);

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

    setBills(res.data?.invoices ?? res.data ?? []);

    if (res.meta?.total) {
      setTotalPages(Math.ceil(res.meta.total / PAGE_SIZE));
    } else {
      setTotalPages(1);
    }
  } catch (err) {
    console.error("ERROR:", err);
    setBills([]);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
};

const handleOpenReceipt = (bill) => {
  console.log("Invoice clicked:", bill);
};

useEffect(() => {
  fetchBills();
}, [currentPage, search, sortType, status]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ادارة الفواتير</h1>
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
