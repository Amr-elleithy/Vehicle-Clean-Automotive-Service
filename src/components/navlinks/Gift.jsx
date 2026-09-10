import { useState, useEffect, useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import { MessageSquare } from "lucide-react";
import { service_gift, baqu, add_gift, display_gifts } from "../../api_contents/api";

export default function Gift() {
  const PAGE_SIZE = 10;
  const [showForm, setShowForm] = useState(false);
  const [services, setServices] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    package_id: "",
    service_id: "",
    description: "",
  });

  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [selectedPackageFilter, setSelectedPackageFilter] = useState("all");
  const [gifts, setGifts] = useState([]);
  const [giftsLoading, setGiftsLoading] = useState(false);

  const SINGLE_WASH_PACKAGE_NAME = "single wash";

  const selectedFormPackage = packages.find(
    (pkg) => pkg.id === formData.package_id,
  );
  const isSingleWashPackage =
    selectedFormPackage?.name?.trim().toLowerCase() ===
    SINGLE_WASH_PACKAGE_NAME;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const digits = value.replace(/\D/g, "");
      setFormData((prev) => ({ ...prev, phone: digits }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePackageChange = (e) => {
    const packageId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      package_id: packageId,
      service_id: "",
    }));
  };

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
      setFormLoading(true);

      console.log("Sending payload:", payload);
      const res = await add_gift(payload);
      console.log("✅ Gift added successfully");
      console.log("Response:", res);

      closeForm();
      fetchGifts();
    } catch (err) {
      console.error("❌ Failed to add gift");

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      } else {
        console.log(err.message);
      }
    } finally {
      setFormLoading(false);
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

  const fetchServices = async () => {
    try {
      const res = await service_gift();
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGifts = async () => {
    try {
      setGiftsLoading(true);

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
      setGiftsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchGifts();
  }, [currentPage, search, sortType, status]);

  useEffect(() => {
    const t = setTimeout(() => {
      setCurrentPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

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
    <div className="p-6">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="text-2xl font-bold mb-6"> الهدايا</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          اضافة هدية جديدة
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={closeForm}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
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
                      <ReactCountryFlag countryCode="SA"svg style={{ width: "1.5em", height: "1.5em" }}/>
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
                    disabled={formLoading}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
                  >
                    {formLoading ? "جاري الإضافة..." : "إضافة"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex items-center gap-3">
          <select
            value={selectedPackageFilter}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedPackageFilter(value);
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

        <div className="mt-6 rounded-xl overflow-hidden">
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
                {giftsLoading ? (
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
    </div>
  );
}