import React from "react";
import { useState, useEffect } from "react";
import { baqu } from "../../api_contents/api";

export default function Baqu() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("automatic");
  const [status, setStatus] = useState("all");
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);

      const res = await baqu({
        page: currentPage,
        limit: 10,
        search: "",
        sortType,
        status,
      });

      console.log(res);

      setPackages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [currentPage, sortType, status]);
  return (
    <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">عرض الباقات</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">صورة الباقة</th>
              <th className="px-4 py-3">اسم الباقة</th>
              <th className="px-4 py-3">نوع الباقة</th>
              <th className="px-4 py-3">عدد الغسلات</th>
              <th className="px-4 py-3">الصلاحية</th>
              <th className="px-4 py-3">الخدمة الاضافية</th>
              <th className="px-4 py-3">سعر الغسلة الواحدة</th>
              <th className="px-4 py-3">السعر الاجمالي</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : (
              packages.map((pkg, index) => (
                <tr key={pkg.id} className="border-t">
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">
                    <img
                      src={pkg.background_url}
                      alt={pkg.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>

                  <td className="px-4 py-3">{pkg.name}</td>

                  <td className="px-4 py-3">
                    {pkg.family_package ? "عائلية" : "فردية"}
                  </td>

                  <td className="px-4 py-3">{pkg.wash_count}</td>

                  <td className="px-4 py-3">{pkg.expiry_date_in_days} يوم</td>

                  <td className="px-4 py-3">{pkg.description}</td>

                  <td className="px-4 py-3">{pkg.price_wash_single} ر.س</td>

                  <td className="px-4 py-3">{pkg.total_price_package} ر.س</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
