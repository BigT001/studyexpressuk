
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface AboutCTAProps {
    ctaTitle: string;
    ctaDescription: string;
    ctaButtonText: string;
    isEditing?: boolean;
    onCtaTitleChange?: (val: string) => void;
    onCtaDescriptionChange?: (val: string) => void;
    onCtaButtonTextChange?: (val: string) => void;
}

export const AboutCTA = ({
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    isEditing,
    onCtaTitleChange,
    onCtaDescriptionChange,
    onCtaButtonTextChange
}: AboutCTAProps) => {
    return (
        <section className="bg-gray-900 py-32 overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                {isEditing ? (
                    <div className="space-y-8">
                        <textarea
                            value={ctaTitle}
                            onChange={(e) => {
                                onCtaTitleChange?.(e.target.value);
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onFocus={(e) => {
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight leading-tight bg-transparent border-none outline-none text-center w-full resize-none h-auto overflow-hidden focus:ring-2 focus:ring-green-500/30 rounded-3xl p-4"
                            rows={1}
                            placeholder="CTA Title..."
                        />
                        <textarea
                            value={ctaDescription}
                            onChange={(e) => {
                                onCtaDescriptionChange?.(e.target.value);
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            onFocus={(e) => {
                                e.target.style.height = 'inherit';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed bg-transparent border-none outline-none text-center w-full resize-none h-auto overflow-hidden focus:ring-2 focus:ring-green-500/30 rounded-2xl p-4"
                            rows={1}
                            placeholder="CTA Description..."
                        />
                    </div>
                ) : (
                    <>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tight leading-tight whitespace-pre-wrap">
                            {ctaTitle}
                        </h2>
                        <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap">
                            {ctaDescription}
                        </p>
                    </>
                )}

                <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
                    {isEditing ? (
                        <div className="flex flex-col items-center gap-2">
                            <input
                                value={ctaButtonText}
                                onChange={(e) => onCtaButtonTextChange?.(e.target.value)}
                                className="group px-12 py-5 bg-white text-gray-900 font-black rounded-2xl border-none outline-none focus:ring-2 focus:ring-green-500/30 text-center"
                                placeholder="Button Text..."
                            />
                            <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Button Text</span>
                        </div>
                    ) : (
                        <a href="/auth/signup" className="group px-12 py-5 bg-white text-gray-900 font-black rounded-2xl hover:bg-green-500 hover:text-white transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                            {ctaButtonText}
                        </a>
                    )}

                    {!isEditing && (
                        <a href="/contact" className="text-white font-bold flex items-center gap-2 hover:gap-4 transition-all">
                            Contact us for more information <ArrowRight className="w-5 h-5" />
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
};
