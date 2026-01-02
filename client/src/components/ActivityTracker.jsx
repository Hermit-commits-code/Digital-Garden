import React from "react";

export default function ActivityTracker({ posts = [] }) {
  // 1. Generate the last 91 days (13 weeks)
  const days = Array.from({ length: 91 }, (_, i) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (90 - i));
    return date;
  });

  const postDates = new Set(
    posts.map((p) => {
      const d = new Date(p.createdAt);
      return d.toISOString().split("T")[0];
    })
  );

  // 2. Identify where months change to place labels
  const monthLabels = [];
  days.forEach((date, index) => {
    if (date.getDate() === 1 || index === 0) {
      monthLabels.push({
        name: date.toLocaleString("default", { month: "short" }),
        index: index,
      });
    }
  });

  if (!posts || posts.length === 0) return null;

  console.log(
    "Heatmap Ends On:",
    days[days.length - 1].toISOString().split("T")[0]
  );
  console.log("Your Post Dates:", Array.from(postDates));

  return (
    <div className="bg-bg-card p-8 rounded-3xl border border-border my-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-text-muted">
          Garden Growth
        </h3>
        <span className="text-[10px] font-bold text-accent uppercase">
          {posts.length} Seeds Planted
        </span>
      </div>

      <div className="flex gap-3">
        {/* Day Labels Column */}
        <div className="flex flex-col justify-between text-[9px] font-bold text-stone-400 pb-2 pt-6">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="flex-1">
          {/* Month Labels Row */}
          <div className="relative w-full h-5 mb-1">
            {monthLabels.map((label, i) => (
              <span
                key={i}
                className="absolute text-[9px] font-bold text-stone-400 uppercase"
                style={{ left: `${(label.index / days.length) * 100}%` }}
              >
                {label.name}
              </span>
            ))}
          </div>

          {/* The Grid */}
          <div
            className="grid grid-flow-col gap-1.5"
            style={{
              gridTemplateRows: "repeat(7, minmax(0, 1fr))",
            }}
          >
            {days.map((dateObj) => {
              const dateStr = dateObj.toISOString().split("T")[0];
              const hasPost = postDates.has(dateStr);
              const isToday =
                dateStr === new Date().toISOString().split("T")[0];

              return (
                <div
                  key={dateStr}
                  // Fix: Use the dateObj for a better readable title
                  title={dateObj.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  className={`w-3.5 h-3.5 rounded-[3px] transition-all duration-500 ${
                    hasPost
                      ? "bg-[#4ade80] shadow-[0_0_10px_rgba(74,222,128,0.5)] scale-110 z-10"
                      : "bg-stone-200 hover:bg-stone-300"
                  } ${isToday ? "ring-2 ring-stone-400 ring-offset-1" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
