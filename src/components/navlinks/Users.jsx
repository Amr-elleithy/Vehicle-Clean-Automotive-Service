import React, { useState } from "react";
import Managers_mail from "./User_tabs/Managers_mail";
import Users_mail from "./User_tabs/Users_mail";
import registerUser from "../../api_contents/api";

function Users() {
  const [activeTab, setActiveTab] = useState("managers_mail");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    avatarFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      alert("تم إنشاء المستخدم بنجاح");

      setShowForm(false);
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message || "حدث خطأ");
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6">ادارة حسابات المستخدمين</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          اضافة مستخدم جديد
        </button>
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
            <div className="flex justify-between items-center border-b p-6">
              <h2 className="text-2xl font-bold">إضافة مستخدم جديد</h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                <input
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="الاسم الأول"
                  className="border rounded-lg p-3 col-span-1"
                  required
                />

                <input
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="الاسم الثاني"
                  className="border rounded-lg p-3 col-span-1"
                  required
                />

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني"
                  className="border rounded-lg p-3 col-span-2"
                  required
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  dir="rtl"
                  placeholder="رقم الهاتف"
                  className="border rounded-lg p-3 col-span-2"
                  required
                />

                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="كلمة المرور"
                  className="border rounded-lg p-3 col-span-2"
                  required
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    الصلاحية
                  </option>

                  <option value="ADMIN">ADMIN</option>
                  <option value="CLIENT">CLIENT</option>
                </select>

                {/* Buttons */}
                <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 rounded-lg border"
                  >
                    تراجع
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    إضافة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("managers_mail")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "managers_mail"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            حسابات مدير النظام
          </button>

          <button
            onClick={() => setActiveTab("users_mail")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "users_mail"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            حسابات مستخدمي التطبيق
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "managers_mail" && <Managers_mail />}
          {activeTab === "users_mail" && <Users_mail />}
        </div>
      </div>
    </div>
  );
}

export default Users;
