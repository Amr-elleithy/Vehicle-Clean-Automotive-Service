import React from "react";
import { useState } from "react";
import Users_points from "./Points_tabs/Users_points";
import Bikers_points from "./Points_tabs/Bikers_points";
import Points_management from "./Points_tabs/Points_management";
import ReactCountryFlag from "react-country-flag";

export default function Point() {
  const [activeTab, setActiveTab] = useState("users_points");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    accountType: "user",
    points: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    const pointsNum = Number(formData.points);
    if (formData.points === "" || Number.isNaN(pointsNum)) {
      newErrors.points = "يرجى إدخال عدد النقاط";
    } else if (!Number.isInteger(pointsNum) || pointsNum < 0) {
      newErrors.points = "عدد النقاط يجب أن يكون رقمًا صحيحًا موجبًا";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        phone: `+966${formData.phone.slice(1)}`,
        accountType: formData.accountType,
        points: Number(formData.points),
      };

      console.log("Submitting points payload:", payload);

      setFormData({ phone: "", accountType: "user", points: "" });
      setErrors({});
      setShowForm(false);
    } catch (err) {
      console.error("ERROR submitting:", err);
      alert("حدث خطأ أثناء الإضافة، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6">ادارة النقاط </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          اضافة نقاط جديدة
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
              <h2 className="text-2xl font-bold">اضافة نقاط جديدة</h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

                {/* Phone Number */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">رقم الجوال</label>

                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="5XXXXXXXX"
                      maxLength={9}
                      className="flex-1 p-3 outline-none text-right"
                      required
                    />

                    <div className="flex items-center gap-2 px-3 bg-gray-100 border-l">
                      <ReactCountryFlag
                        countryCode="SA"
                        svg
                        style={{
                          width: "1.5em",
                          height: "1.5em",
                        }}
                      />
                      <span className="font-medium">+966</span>
                    </div>
                  </div>
                </div>

                {/* Account Type: user or biker */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">نوع الحساب</label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3 text-right"
                  >
                    <option value="user">مستخدم</option>
                    <option value="biker">بايكر</option>
                  </select>
                </div>

                {/* Points Number */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">عدد النقاط</label>
                  <input
                    type="number"
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    placeholder="أدخل عدد النقاط"
                    min="0"
                    step="1"
                    className={`w-full border rounded-lg p-3 ${
                      errors.points ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.points && (
                    <p className="text-red-500 text-sm mt-1">{errors.points}</p>
                  )}
                </div>

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
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                  >
                    {loading ? "جاري الإضافة..." : "اضافة"}
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
            onClick={() => setActiveTab("users_points")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "users_points"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            نقاط المستخدمين
          </button>

          <button
            onClick={() => setActiveTab("bikers_points")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "bikers_points"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            نقاط البايكرز
          </button>

          <button
            onClick={() => setActiveTab("points_management")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "points_management"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            ادارة عدد النقاط
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "users_points" && <Users_points />}
          {activeTab === "bikers_points" && <Bikers_points />}
          {activeTab === "points_management" && <Points_management />}
        </div>
      </div>
    </div>
  );
}
