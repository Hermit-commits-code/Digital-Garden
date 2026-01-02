import React from "react";

export default function GardenTracker({ posts = [] }) {
  // 1. Calculate the start date (the Monday of the week of your first post)
  // Or hardcode a start date for your "Garden"
  const startDate = new Date("2025-12-28"); // A Sunday/Monday to align the grid
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Generate days from start to "Today + 1" (to show the empty slot for tomorrow)
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const diffTime = Math.abs(tomorrow - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Ensure we always have full 7-day columns by rounding up to nearest week
  const totalSlots = Math.ceil(diffDays / 7) * 7;

  const days = Array.from({ length: totalSlots }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  const postCounts = posts.reduce((acc, post) => {
    const date = new Date(post.createdAt).toISOString().split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const getLevel = (count, dateObj) => {
    if (dateObj > today)
      return "bg-stone-100 border border-dashed border-stone-200"; // Future slot
    if (!count) return "bg-stone-200";
    if (count === 1) return "bg-emerald-300 scale-90";
    if (count === 2) return "bg-emerald-500 shadow-[0_0_8px_#10b981]";
    return "bg-emerald-700 shadow-[0_0_12px_#047857] scale-110";
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-stone-100 my-8 shadow-sm w-fit mx-auto">
      <div className="flex justify-between items-center mb-6 gap-8">
        <div>
          <h3 className="text-sm font-bold text-stone-800 tracking-tight">
            Pixel Garden
          </h3>
          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
            Growing since Dec '25
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-black text-emerald-600 leading-none">
            {posts.length}
          </span>
          <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tighter">
            Seeds
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Day Labels */}
        <div className="flex flex-col justify-between text-[8px] font-bold text-stone-300 py-1 uppercase">
          <span>M</span>
          <span>W</span>
          <span>F</span>
          <span>S</span>
        </div>

        {/* The Growing Grid */}
        <div
          className="grid grid-flow-col gap-1.5"
          style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
        >
          {days.map((dateObj) => {
            const dateStr = dateObj.toISOString().split("T")[0];
            const count = postCounts[dateStr] || 0;
            const isToday = dateStr === today.toISOString().split("T")[0];

            return (
              <div
                key={dateStr}
                title={dateObj.toDateString()}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${getLevel(
                  count,
                  dateObj
                )} 
                ${isToday ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
