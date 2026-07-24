import React, { useState, useEffect } from "react";
import { admin_points } from "../../../api_contents/api";

export default function Points_management() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAdminPoints = async () => {
    try {
      setLoading(true);
      const res = await admin_points();
      setData(res.data ?? null);
    } catch (err) {
      console.error("ERROR:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPoints();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-right">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">نقاط البايكر</th>
            <th className="px-4 py-3">نقاط العملاء</th>
            <th className="px-4 py-3">النقاط المطلوبة للاستحقاق</th>
            <th className="px-4 py-3">نوع الجائزة</th>
            <th className="px-4 py-3">تاريخ التحديث </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-500">
                جاري التحميل...
              </td>
            </tr>
          ) : !data ? (
            <tr>
              <td colSpan={6} className="py-10 text-center text-gray-500">
                لا توجد بيانات
              </td>
            </tr>
          ) : (
            <tr className="border-t">
              <td className="px-4 py-3">1</td>
              <td className="px-4 py-3">{data.biker_points}</td>
              <td className="px-4 py-3">{data.client_points}</td>
              <td className="px-4 py-3">{data.redeem_points}</td>
              <td className="px-4 py-3">{data.reward_package?.name ?? "-"}</td>
              <td className="px-4 py-3">
                {data.reward_package?.updated_at
                  ? new Date(
                      data.reward_package.updated_at,
                    ).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
