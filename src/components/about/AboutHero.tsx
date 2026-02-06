'use client';

import React from 'react';

interface AboutHeroProps {
    title: string;
    tagline: string;
    imageUrl: string;
    heroDescription: string;
    isEditing?: boolean;
    onTitleChange?: (val: string) => void;
    onTaglineChange?: (val: string) => void;
    onImageUrlChange?: (val: string) => void;
    onHeroDescriptionChange?: (val: string) => void;
}

export const AboutHero = ({
    title,
    tagline,
    imageUrl,
    heroDescription,
    isEditing,
    onTitleChange,
    onTaglineChange,
    onImageUrlChange,
    onHeroDescriptionChange
}: AboutHeroProps) => {
    return (
        <section className={`relative h-[65vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden bg-gray-900 font-sans`}>
            {imageUrl ? (
                <div className="absolute inset-0 z-0 group/hero">
                    <img
                        src={imageUrl}
                        alt=""
                        className="w-full h-full object-cover grayscale-[10%] brightness-[0.35]"
                        aria-hidden="true"
                    />
                    {isEditing && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity z-20">
                            <input
                                value={imageUrl}
                                onChange={(e) => onImageUrlChange?.(e.target.value)}
                                className="bg-black/80 text-white text-[10px] px-4 py-2 rounded-full border border-white/20 w-64 text-center focus:w-96 transition-all"
                                placeholder="Hero Image URL..."
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="absolute inset-0 bg-gray-800 z-0"></div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 z-[1]"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white pt-20">
                <div className={`inline-flex items-center gap-2 px-6 py-2 mb-8 text-sm font-bold tracking-[0.2em] uppercase bg-green-600/90 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(22,163,74,0.4)] ${isEditing ? 'hover:ring-2 ring-white/50 transition-all' : ''}`}>
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    {isEditing ? (
                        <input
                            value={tagline}
                            onChange={(e) => onTaglineChange?.(e.target.value)}
                            className="bg-transparent border-none outline-none text-center w-32 focus:w-48 transition-all"
                            placeholder="Tagline..."
                        />
                    ) : tagline}
                </div>

                {isEditing ? (
                    <textarea
                        value={title}
                        onChange={(e) => {
                            onTitleChange?.(e.target.value);
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onFocus={(e) => {
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl bg-transparent border-none outline-none text-center w-full resize-none h-auto overflow-hidden focus:ring-2 focus:ring-green-500/30 rounded-3xl p-2"
                        rows={1}
                    />
                ) : (
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] drop-shadow-2xl">
                        {title}
                    </h1>
                )}

                {isEditing ? (
                    <textarea
                        value={heroDescription}
                        onChange={(e) => {
                            onHeroDescriptionChange?.(e.target.value);
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onFocus={(e) => {
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium bg-transparent border-none outline-none text-center w-full resize-none h-auto overflow-hidden focus:ring-2 focus:ring-green-500/30 rounded-2xl p-2"
                        rows={1}
                    />
                ) : (
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
                        {heroDescription}
                    </p>
                )}
            </div>
        </section>
    );
};
