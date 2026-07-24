import React from 'react'
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Trash2 } from "lucide-react";
import "./ColorPicker.css";
import {color} from "../../../api_contents/api";

export default function Cars_colors_management() {
  const [color, setColor] = useState("#b1adad");
  const [addedColors, setAddedColors] = useState([]);
  const [colors, setColors] = useState([]);
  const handleAddColor = () => {
    if (!addedColors.includes(color)) {
      setAddedColors([...addedColors, color]);
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-sm font-bold text-right"> إضافة ألوان السيارات</h2>
      <p className="text-gray-500 text-right mb-6">
        حدد اللون ثم اضغط إضافة اللون
      </p>

      {/* Picker */}
      <div className="border-2 border-dashed rounded-xl p-2 flex justify-center pd-6">
        <HexColorPicker color={color} onChange={setColor}
          style={{
            width: "100%",
            height: "300px"
          }}
        />
      </div>
      
      {/* Bottom */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center mt-6">

  <button
    onClick={handleAddColor}
    className="rounded-lg bg-yellow-100 px-5 py-2 shadow hover:bg-yellow-200"
  >
    أضف اللون +
  </button>

  <div className="flex items-center gap-2">
    <input
      value={color}
      readOnly
      className="border rounded-lg px-3 py-2 w-28 sm:w-40 text-center"
    />

    <div
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border shrink-0"
      style={{ backgroundColor: color }}
    ></div>
  </div>

</div>

      {/* Added Colors */}
<div className="mt-8 rounded-xl border border-gray-200 p-3 sm:p-4">
  <h3 className="mb-4 text-right text-lg font-semibold">
    الألوان المضافة
  </h3>

  {addedColors.length === 0 ? (
    <p className="text-center text-gray-400">
      لم يتم إضافة أي لون بعد
    </p>
  ) : (
    <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
      {addedColors.map((c, index) => (
        <div
          key={index}
          className="relative flex flex-col items-center rounded-lg border bg-white p-2 shadow w-20 sm:w-24"
        >
          <button
            onClick={() =>
              setAddedColors(addedColors.filter((_, i) => i !== index))
            }
            className="absolute top-1 left-1 rounded-full p-1 text-red-500 hover:bg-red-100"
            title="حذف اللون"
          >
            <Trash2 size={14} />
          </button>

          <div
            className="mb-2 h-10 w-10 sm:h-14 sm:w-14 rounded-md border"
            style={{ backgroundColor: c }}
          />

          <span className="text-[10px] sm:text-xs font-medium break-all text-center">
            {c}
          </span>
        </div>
      ))}
    </div>
  )}
</div>

      {/* Selected Colors */}
      {colors.length > 0 && (
        <div className="mt-8">

          <h3 className="font-semibold mb-3 text-right"> الألوان المختارة</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((c) => (
              <div key={c}className="w-14 h-14 rounded-lg border" style={{ backgroundColor: c }} title={c}/>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
