
'use client';

import React from 'react';

interface Stat {
    value: string;
    label: string;
    color: string;
}

interface AboutStatsProps {
    stats: Stat[];
    isEditing?: boolean;
    onStatChange?: (index: number, field: string, value: string) => void;
}

export const AboutStats = ({ stats, isEditing, onStatChange }: AboutStatsProps) => {
    return (
        <div className="relative z-20 -mt-16 max-w-6xl mx-auto px-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 p-8 md:p-14 flex flex-wrap justify-around items-center gap-8">
                {stats.map((stat, idx) => (
                    <React.Fragment key={idx}>
                        <div className="text-center group flex flex-col items-center">
                            {isEditing ? (
                                <>
                                    <input
                                        value={stat.value}
                                        onChange={(e) => onStatChange?.(idx, 'value', e.target.value)}
                                        className={`text-4xl md:text-5xl font-black mb-2 text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-green-500/30 rounded-xl w-32 ${stat.color.includes('green') ? 'text-green-600' : stat.color.includes('blue') ? 'text-blue-600' : 'text-orange-500'}`}
                                        placeholder="Value..."
                                    />
                                    <input
                                        value={stat.label}
                                        onChange={(e) => onStatChange?.(idx, 'label', e.target.value)}
                                        className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black text-center bg-transparent border-none outline-none focus:ring-2 focus:ring-green-500/30 rounded-lg w-24"
                                        placeholder="Label..."
                                    />
                                </>
                            ) : (
                                <>
                                    <div className={`text-5xl md:text-6xl font-black mb-2 transition-transform group-hover:scale-110 duration-300 ${stat.color.includes('green') ? 'text-green-600' : stat.color.includes('blue') ? 'text-blue-600' : 'text-orange-500'}`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase tracking-[0.2em] font-black">{stat.label}</div>
                                </>
                            )}
                        </div>
                        {idx < stats.length - 1 && (
                            <div className="h-16 w-px bg-gray-200/50 hidden md:block"></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};
