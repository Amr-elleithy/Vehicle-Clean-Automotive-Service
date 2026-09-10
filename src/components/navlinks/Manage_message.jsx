import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { sms } from "../../api_contents/api";

const SENDER_IDS = [
  { id: "QuickySA-AD", name: "QuickySA-AD" },
  { id: "REPLACE_ME", name: "REPLACE_ME" },
];

export default function Sms_list() {
  const PAGE_SIZE = 10;
  const PAGE_WINDOW = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    receiver_type: "",
    message: "",
    sender_id: "",
  });

  // Pagination calculations
  const startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);
  const adjustedStartPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  const pages = Array.from(
    { length: endPage - adjustedStartPage + 1 },
    (_, i) => adjustedStartPage + i,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      receiver_type: "",
      message: "",
      sender_id: "",
    });
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      receiver_type: formData.receiver_type,
      message: formData.message,
      sender_id: formData.sender_id,
    };

    try {
      setLoading(true);

      console.log("Sending SMS:", payload);

      console.log("SMS sent successfully");

      closeForm();
      fetchSms();
    } catch (err) {
      console.error("Failed to send SMS");

      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);

    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchSms = async () => {
    try {
      setLoading(true);

      const res = await sms(currentPage, PAGE_SIZE, search, sortType, status);

      setMessages(res.data?.sms ?? res.data ?? []);

      if (res.meta?.total) {
        setTotalPages(Math.ceil(res.meta.total / PAGE_SIZE));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error("ERROR:", err);
      setMessages([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSms();
  }, [currentPage, search, sortType, status]);

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6">ادارة الرسائل النصية</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          اضافة رسالة نصية
        </button>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <select
          value={sortType}
          onChange={(e) => {
            setCurrentPage(1);
            setSortType(e.target.value);
          }}
          className="w-64 rounded-lg border border-gray-300 bg-white px-4 py-2 text-right shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none shrink-0"
        >
          <option value="automatic">تلقائي</option>
          <option value="asc">تصاعدي (الأقدم إلى الأحدث)</option>
          <option value="desc">تنازلي (الأحدث إلى الأقدم)</option>
        </select>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b p-6">
              <h2 className="text-2xl font-bold">إرسال رسالة نصية</h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Receiver Type */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">نوع الإرسال</label>

                  <select
                    name="receiver_type"
                    value={formData.receiver_type}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">اختر النوع</option>
                    <option value="all">جميع المستخدمين</option>
                    <option value="specific">مستخدم محدد</option>
                  </select>
                </div>

                {/* Message */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">الرسالة</label>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="اكتب الرسالة..."
                    className="w-full border rounded-lg p-3 resize-none"
                  />
                </div>

                {/* Sender ID */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">Sender ID</label>

                  <select
                    name="sender_id"
                    value={formData.sender_id}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                  >
                    <option value="">اختر Sender ID</option>

                    {SENDER_IDS.map((sender) => (
                      <option key={sender.id} value={sender.id}>
                        {sender.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-2 rounded-lg border"
                  >
                    تراجع
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    إرسال
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-right">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">نوع الرسالة</th>
                <th className="px-4 py-3">اسم المستخدم</th>
                <th className="px-4 py-3">رقم الجوال</th>
                <th className="px-4 py-3">الرسالة</th>
                <th className="px-4 py-3">معرف المرسل</th>
                <th className="px-4 py-3">تاريخ الارسال</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    جاري التحميل...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    لا توجد بيانات
                  </td>
                </tr>
              ) : (
                messages.map((msg, index) => (
                  <tr key={msg.id ?? index} className="border-t">
                    <td className="px-4 py-3">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">{msg.type}</td>
                    <td className="px-4 py-3">
                      {[msg.user?.first_name, msg.user?.last_name]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </td>
                    <td className="px-4 py-3" dir="ltr">
                      {msg.user?.phone}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => alert(msg.text)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <MessageSquare size={18} />
                      </button>
                    </td>
                    <td className="px-4 py-3">{msg.sender_id}</td>
                    <td className="px-4 py-3">
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleDateString()
                        : "-"}
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