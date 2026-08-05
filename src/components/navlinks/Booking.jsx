import { useState } from "react";
import Subscriptions from "./Booking_tabs/Subscriptions";
import Reservations from "./Booking_tabs/Reservations";

function Booking() {
  const [activeTab, setActiveTab] = useState("reservations");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        ادارة الاشتراكات و الحجوزات
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("reservations")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "reservations"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            قائمة الحجوزات
          </button>

          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`flex-1 py-4 font-semibold transition ${
              activeTab === "subscriptions"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            ادارة الاشتراكات
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "reservations" && <Reservations />}
          {activeTab === "subscriptions" && <Subscriptions />}
        </div>
      </div>
    </div>
  );
}

export default Booking;