'use client';

export function QuickActionsSection() {
  return (
    <div className="bg-gradient-to-r from-[#008200] to-[#006600] rounded-2xl p-8 text-white shadow-lg">
      <h3 className="text-2xl font-black mb-6">Quick Actions</h3>
      <div className="grid md:grid-cols-4 gap-4">
        <button className="group p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 font-semibold">
          <span className="text-3xl">🎯</span>
          Start Learning
        </button>
        <button className="group p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 font-semibold">
          <span className="text-3xl">🔗</span>
          Join Event
        </button>
        <button className="group p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 font-semibold">
          <span className="text-3xl">⭐</span>
          Get Premium
        </button>
        <button className="group p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 font-semibold">
          <span className="text-3xl">💬</span>
          Contact Support
        </button>
      </div>
    </div>
  );
}
