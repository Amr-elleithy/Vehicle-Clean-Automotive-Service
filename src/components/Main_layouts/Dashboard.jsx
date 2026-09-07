import { useEffect, useState } from "react";
import { statistics } from "../../api_contents/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [clientsCount, setClientsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [additionServicesUsesCount, setAdditionServicesUsesCount] = useState(0);
  const [packageExpiredCount, setPackageExpiredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await statistics({
          page: 1,
          limit: 10,
          search: "",
          sortType: "automatic",
          status: "all",
        });

        const data = response.data;

        console.log("STATISTICS DATA:", data);

        setClientsCount(data.uesrsCount ?? 0);
        setOrdersCount(data.ordersCount ?? 0);
        setAdditionServicesUsesCount(data.addtionServicesUsesCount ?? 0);
        setPackageExpiredCount(data.packageExpiredCount ?? 0);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>

        <p className="mt-1 text-sm text-slate-500">
          نظرة عامة على نظام إدارة ورشة السيارات
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Clients / Booking box */}
        <div className="text-right rounded-2xl bg-white border border-slate-200 p-5 shadow-sm
                     hover:shadow-md hover:border-blue-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">إجمالي العملاء</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {clientsCount}
              </h2>

              <button type="button" onClick={() => navigate("/admin/users")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                عرض الحجوزات ←
              </button>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              👥
            </div>
          </div>
        </div>

        {/* Second box - Orders */}
        <div className="text-right rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">إجمالي الحجوزات</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {ordersCount}
              </h2>

              <button type="button" onClick={() => navigate("/admin/booking")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                عرض التفاصيل ←
              </button>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              📅
            </div>
          </div>
        </div>

        {/* Third box - Additional Services */}
        <div className="text-right rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                عدد الخدمات الاضافيه المستخدمه
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {additionServicesUsesCount}
              </h2>

              <button type="button" onClick={() => navigate("/admin/services")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                عرض التفاصيل ←
              </button>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              💳
            </div>
          </div>
        </div>

        {/* Fourth box - Expired Packages */}
        <div className="text-right rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">عدد الباقات الاضافية</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-800">
                {packageExpiredCount}
              </h2>

              <button type="button" onClick={() => navigate("/admin/baqu")}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                عرض التفاصيل ←
              </button>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              🔧
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}