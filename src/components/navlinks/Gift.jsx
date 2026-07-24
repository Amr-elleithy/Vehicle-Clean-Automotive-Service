import React from "react";
import { useState, useEffect } from "react";
import Gifts_send_list from "./Gifts_tabs/Gifts_send_list";
import ReactCountryFlag from "react-country-flag";
import { service_gift } from "../../api_contents/api";
import { baqu } from "../../api_contents/api";
import { add_gift } from "../../api_contents/api";

export default function Gift() {
  const [activeTab, setActiveTab] = useState("Gifts_send_list");
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [formData, setFormData] = useState({
    phone: "",
    package_id: "",
    service_id: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        phone: digits,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SINGLE_WASH_PACKAGE_NAME = "single wash";

  const selectedPackage = packages.find(
    (pkg) => pkg.id === formData.package_id,
  );
  const isSingleWashPackage =
    selectedPackage?.name?.trim().toLowerCase() === SINGLE_WASH_PACKAGE_NAME;

  const handlePackageChange = (e) => {
    const packageId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      package_id: packageId,
      service_id: "",
    }));
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await baqu({
        page: 1,
        limit: 10,
        search: "",
        sortType: "automatic",
        status: "all",
      });

      setPackages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await service_gift();
        setServices(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  const resetForm = () => {
    setFormData({
      phone: "",
      package_id: "",
      service_id: "",
      description: "",
    });
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      package_id: formData.package_id,
      services: formData.service_id ? [formData.service_id] : [],
      receiver_phone_number: `+966${formData.phone}`,
      message: formData.description,
    };

    try {
      setLoading(true);

      console.log("Sending payload:", payload);

      const res = await add_gift(payload);

      console.log("✅ Gift added successfully");
      console.log("Response:", res);

      closeForm();
    } catch (err) {
      console.error("❌ Failed to add gift");

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      } else {
        console.log(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6">ادارة حسابات المستخدمين</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          اضافة هدية جديدة
        </button>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={closeForm}
        >
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b p-6">
              <h2 className="text-2xl font-bold">إضافة هدية جديدة</h2>
            </div>

            {/* Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {/* Phone */}
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

                {/* Package Select */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">اختر الباقة</label>

                  <select
                    name="package_id"
                    value={formData.package_id}
                    onChange={handlePackageChange}
                    className="w-full border rounded-lg p-3"
                    required
                  >
                    <option value="">اختر الباقة</option>

                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Select - appears only when the selected package is "single wash" */}
                {isSingleWashPackage && (
                  <div className="col-span-2">
                    <label className="block mb-2 font-medium">
                      اختر الخدمة
                    </label>

                    <select
                      name="service_id"
                      value={formData.service_id}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-3"
                      required
                    >
                      <option value="">اختر الخدمة</option>

                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Description */}
                <div className="col-span-2">
                  <label className="block mb-2 font-medium">الوصف</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="نص الرسالة"
                    rows={4}
                    className="w-full border rounded-lg p-3 resize-none"
                  />
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
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
                  >
                    {loading ? "جاري الإضافة..." : "إضافة"}
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
            onClick={() => setActiveTab("Gifts_send_list")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "Gifts_send_list"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            قائمة الهدايا المرسلة
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "Gifts_send_list" && <Gifts_send_list />}
        </div>
      </div>
    </div>
  );
}
