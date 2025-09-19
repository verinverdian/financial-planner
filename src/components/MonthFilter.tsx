"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar } from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";

interface MonthFilterProps {
  value: string; // format "YYYY-MM"
  onChange: (month: string) => void;
}

export default function MonthFilter({ value, onChange }: MonthFilterProps) {
  const [year, month] = value.split("-").map(Number);
  const selectedDate = new Date(year, month - 1);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dark:bg-gray-600">
      <div className="flex items-center gap-4 mb-4">
        <label className="text-gray-700 font-medium">Pilih Bulan:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            if (date) {
              const newMonth = `${date.getFullYear()}-${String(
                date.getMonth() + 1
              ).padStart(2, "0")}`;
              onChange(newMonth);
              setIsOpen(false);
            }
          }}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          locale={id} // Gunakan locale Indonesia
          onCalendarOpen={() => setIsOpen(true)}
          onCalendarClose={() => setIsOpen(false)}
          customInput={
            <button
              type="button"
              className={`flex items-center gap-2 bg-white border border-green-500 text-green-500 font-medium px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:bg-green-500 hover:text-white ${isOpen ? "bg-green-500 text-white" : ""
                }`}
            >
              <Calendar size={18} />
              {format(selectedDate, "MMMM yyyy", { locale: id })}
            </button>
          }
        />
      </div>
    </div>
  );
}
