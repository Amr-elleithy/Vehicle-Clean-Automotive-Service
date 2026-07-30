import Cars_management from "./Cars_tabs/Cars_management";
import Cars_colors_management from "./Cars_tabs/Cars_colors_management";
import Brands_management from "./Cars_tabs/Brands_management";
import React, { useState, useEffect } from "react";
import { getBrands } from "../../api_contents/api";
import { createBrands, createVehicleBrands } from "../../api_contents/api";

export default function Cars() {
  const [activeTab, setActiveTab] = useState("cars_management");
  const [showBrandForm, setShowBrandForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandFormData, setBrandFormData] = useState({
    logo: null,
    brandname_en: "",
    brandname_ar: "",
  });
  const [modelFormData, setModelFormData] = useState({
    vehicle_brand_id: "",
    name_en: "",
    name_ar: "",
  });

  const handleBrandChange = (e) => {
    const { name, value, files } = e.target;

    setBrandFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleModelChange = (e) => {
    const { name, value } = e.target;

    setModelFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("logo", brandFormData.logo);
    data.append("brandname_en", brandFormData.brandname_en);
    data.append("brandname_ar", brandFormData.brandname_ar);

    try {
      const res = await createBrands(data);

      console.log("✅ Brand created successfully!");
      console.log("Response:", res);

      setShowBrandForm(false);
    } catch (err) {
      console.log("❌ Failed to create brand!");

      // Show the server's response if available
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Error:", err.response.data);
      } else {
        console.log(err.message);
      }
    }
  };

  const handleModelSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createVehicleBrands(modelFormData);

      console.log("✅ Success", res);

      setShowCarForm(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrands();
        console.log(res.data[0]);
        setBrands(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6">ادارة معلومات السيارات</h1>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setShowBrandForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            اضافة براند جديد
          </button>

          <button
            onClick={() => setShowCarForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            اضافة سيارة جديدة
          </button>
        </div>

        {showBrandForm && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setShowBrandForm(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b p-6">
                <h2 className="text-2xl font-bold">إضافة براند جديد</h2>
              </div>

              {/* Body */}
              <div className="p-6">
                <form
                  onSubmit={handleBrandSubmit}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Logo Upload */}
                  <div className="col-span-2">
                    <label className="block mb-2 font-medium">
                      صورة العلامة التجارية
                    </label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      onChange={handleBrandChange}
                      className="w-full border rounded-lg p-3"
                      required
                    />
                  </div>

                  {/* Brand Name EN */}
                  <input
                    type="text"
                    name="brandname_en"
                    value={brandFormData.brandname_en}
                    onChange={handleBrandChange}
                    placeholder="Brand Name (English)"
                    className="border rounded-lg p-3"
                    required
                  />

                  {/* Brand Name AR */}
                  <input
                    type="text"
                    name="brandname_ar"
                    value={brandFormData.brandname_ar}
                    onChange={handleBrandChange}
                    placeholder="اسم العلامة التجارية"
                    className="border rounded-lg p-3"
                    dir="rtl"
                    required
                  />

                  {/* Buttons */}
                  <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
                    <button
                      type="button"
                      onClick={() => setShowBrandForm(false)}
                      className="px-6 py-2 rounded-lg border"
                    >
                      تراجع
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-blue-600 text-white"
                    >
                      إضافة براند جديد
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showCarForm && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setShowCarForm(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center border-b p-6">
                <h2 className="text-2xl font-bold">إضافة سيارة جديدة</h2>
              </div>

              {/* Body */}
              <div className="p-6">
                <form
                  onSubmit={handleModelSubmit}
                  className="grid grid-cols-2 gap-4"
                >
                  {/* Select brand */}
                  <div className="col-span-2">
                    <select
                      name="vehicle_brand_id"
                      value={modelFormData.vehicle_brand_id}
                      onChange={handleModelChange}
                      className="w-full border rounded-lg p-3"
                    >
                      <option value="">اختر البراند</option>

                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Model Name EN */}
                  <input
                    type="text"
                    name="name_en"
                    value={modelFormData.name_en}
                    onChange={handleModelChange}
                    placeholder="اسم المودل بالنجليزية"
                    className="border rounded-lg p-3"
                    required
                  />

                  {/* Model Name AR */}
                  <input
                    type="text"
                    name="name_ar"
                    value={modelFormData.name_ar}
                    onChange={handleModelChange}
                    placeholder="اسم المودل بالعربية"
                    className="border rounded-lg p-3"
                    dir="rtl"
                    required
                  />

                  {/* Buttons */}
                  <div className="col-span-2 flex justify-end gap-3 pt-4 border-t mt-2">
                    <button
                      type="button"
                      onClick={() => setShowCarForm(false)}
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
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("cars_management")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "cars_management"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            ادارة السيارات
          </button>

          <button
            onClick={() => setActiveTab("cars_colors_management")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "cars_colors_management"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            ادارة ألوان السيارات
          </button>

          <button
            onClick={() => setActiveTab("brands_management")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "brands_management"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            ادارة البراندات
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "cars_management" && <Cars_management />}
          {activeTab === "cars_colors_management" && <Cars_colors_management />}
          {activeTab === "brands_management" && <Brands_management />}
        </div>
      </div>
    </div>
  );
}
