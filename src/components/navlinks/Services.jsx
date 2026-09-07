import { useState, useEffect } from "react";
import { get_services, post_services } from "../../api_contents/api";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
   // Modal state
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    duration_by_minute: "",
    price: "",
  });

   // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);

    setFormData({
      name_ar: "",
      name_en: "",
      price: "",
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const serviceData = {
        name_ar: formData.name_ar,
        name_en: formData.name_en,
        duration_by_minute: Number(formData.duration_by_minute),
        price: Number(formData.price),
      };

    console.log("POST DATA:", serviceData);

    const response = await post_services(serviceData);

    console.log("CREATE SERVICE RESPONSE:", response);

    // Close modal
    handleCloseModal();

    // Refresh services
    const servicesResponse = await get_services(
      1,
      10,
      "",
      "automatic",
      "all"
    );

    setServices(servicesResponse.data ?? []);

  } catch (error) {
    console.error("Failed to create service:", error);
  }
};

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await get_services(
          1,          // page
          10,         // limit
          "",         // search
          "automatic", // sortType
          "all"       // status
        );

        console.log("SERVICES:", response);

        setServices(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className="text-2xl font-bold"> خدمات إضافية </h1>

        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={() => setShowModal(true)}>
          إضافة خدمة جديدة
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-slate-500">
            جاري تحميل الخدمات...
          </div>
        ) : services.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            لا توجد خدمات
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    اسم الخدمة
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    المدة
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    السعر
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    الحالة
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">
                    الإجراءات
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {services.map((service, index) => (
                  <tr key={service.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800">
                      {service.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {service.duration_by_minute} دقيقة
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {service.price}
                    </td>

                    <td className="px-6 py-4">
                      {service.is_active ? (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          نشطة
                        </span>
                      ) : (
                        <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          غير نشطة
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button type="button" className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                          تعديل
                        </button>

                        <button type="button" className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">

              <h2 className="text-2xl font-medium text-slate-700">
                إضافة خدمة إضافية جديدة
              </h2>

              <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 text-2xl">
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* Arabic name */}
                <div>
                  <input type="text" name="name_ar" value={formData.name_ar} onChange={handleChange} placeholder="اسم الخدمة بالعربيه"
                    className="w-full h-16 px-5 rounded-xl bg-slate-100 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-right"
                    required/>
                </div>

                {/* English name */}
                <div>
                  <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} placeholder="اسم الخدمة بالانجليزيه"
                    className="w-full h-16 px-5 rounded-xl bg-slate-100 border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-right"
                    required/>
                </div>

                {/* Price */}
                <div>
                  <input type="number" name="duration_by_minute" value={formData.duration_by_minute}
                    onChange={handleChange} placeholder="مدة الخدمة بالدقائق" min="1"
                    className="w-full h-16 px-5 rounded-xl bg-slate-100 border border-transparent
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-right" required/>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t px-6 py-5 flex gap-3">
                <button type="button" onClick={handleCloseModal}
                  className="flex-1 h-12 rounded-lg border border-blue-600 text-slate-700 hover:bg-yellow-50 transition">
                  تراجع
                </button>

                <button type="submit" className="flex-1 h-12 rounded-lg bg-blue-500 text-slate-800 hover:bg-blue-500 transition">
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}