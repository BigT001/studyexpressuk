'use client';

import React from 'react';

interface AboutIntroProps {
    title: string;
    introduction: string;
    isEditing?: boolean;
    onTitleChange?: (val: string) => void;
    onIntroductionChange?: (val: string) => void;
}

export const AboutIntro = ({ title, introduction, isEditing, onTitleChange, onIntroductionChange }: AboutIntroProps) => {
    return (
        <section className={`max-w-4xl mx-auto px-4 pt-32 pb-20 relative`}>
            <div className="text-center space-y-8">
                {isEditing ? (
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                        <input
                            value={title}
                            onChange={(e) => onTitleChange?.(e.target.value)}
                            className="bg-transparent border-none outline-none text-center w-full focus:ring-2 focus:ring-green-500/30 rounded-xl"
                            placeholder="Intro Title..."
                        />
                    </h2>
                ) : (
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                        Welcome to <span className="text-green-600">{title}</span>
                    </h2>
                )}

                {isEditing ? (
                    <textarea
                        value={introduction}
                        onChange={(e) => {
                            onIntroductionChange?.(e.target.value);
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        onFocus={(e) => {
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                        }}
                        className="text-xl md:text-2xl text-gray-500 leading-loose font-medium italic bg-transparent border-none outline-none text-center w-full resize-none h-auto overflow-hidden focus:ring-2 focus:ring-green-500/30 rounded-2xl p-4"
                        rows={1}
                    />
                ) : (
                    <p className="text-xl md:text-2xl text-gray-500 leading-loose font-medium italic">
                        "{introduction}"
                    </p>
                )}

                <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>
        </section>
    );
};
