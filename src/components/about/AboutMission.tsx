
'use client';

import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

interface AboutMissionProps {
    missionTitle: string;
    missionContent: string;
    missionImageUrl: string;
    isEditing?: boolean;
    onMissionTitleChange?: (val: string) => void;
    onMissionContentChange?: (val: string) => void;
    onMissionImageUrlChange?: (val: string) => void;
}

export const AboutMission = ({
    missionTitle,
    missionContent,
    missionImageUrl,
    isEditing,
    onMissionTitleChange,
    onMissionContentChange,
    onMissionImageUrlChange
}: AboutMissionProps) => {
    return (
        <section className={`bg-gray-50 py-24 relative`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-16 items-center text-left">
                    <div className="relative group/mission">
                        <div className="absolute -inset-4 bg-green-500/10 rounded-3xl blur-2xl group-hover/mission:bg-green-500/20 transition-all duration-500"></div>
                        {missionImageUrl ? (
                            <img
                                src={missionImageUrl}
                                alt="Workspace"
                                className="relative rounded-3xl shadow-2xl object-cover h-[400px] w-full"
                            />
                        ) : (
                            <div className="relative rounded-3xl shadow-2xl bg-gray-100 h-[400px] w-full flex items-center justify-center text-gray-400">
                                <Target className="w-12 h-12" />
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover/mission:opacity-100 transition-opacity z-20">
                                <input
                                    value={missionImageUrl}
                                    onChange={(e) => onMissionImageUrlChange?.(e.target.value)}
                                    className="bg-black/80 text-white text-[10px] px-4 py-2 rounded-full border border-white/20 w-64 text-center focus:w-96 transition-all"
                                    placeholder="Mission Image URL..."
                                />
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        <div className="inline-flex p-3 bg-green-100 text-green-600 rounded-2xl">
                            <Target className="w-8 h-8" />
                        </div>
                        {isEditing ? (
                            <input
                                value={missionTitle}
                                onChange={(e) => onMissionTitleChange?.(e.target.value)}
                                className="text-4xl font-black text-gray-900 tracking-tight bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-green-500/30 rounded-xl p-2"
                            />
                        ) : (
                            <h3 className="text-4xl font-black text-gray-900 tracking-tight">{missionTitle}</h3>
                        )}

                        {isEditing ? (
                            <textarea
                                value={missionContent}
                                onChange={(e) => {
                                    onMissionContentChange?.(e.target.value);
                                    e.target.style.height = 'inherit';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                onFocus={(e) => {
                                    e.target.style.height = 'inherit';
                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                                className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap bg-transparent border-none outline-none w-full focus:ring-2 focus:ring-green-500/30 rounded-xl p-2 h-auto resize-none overflow-hidden"
                                rows={1}
                            />
                        ) : (
                            <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {missionContent}
                            </p>
                        )}

                        <div className="pt-4">
                            <a href="/courses" className="inline-flex items-center gap-2 font-bold text-green-600 hover:gap-4 transition-all">
                                Explore our programs <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
