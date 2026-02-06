
'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface Feature {
    icon: string;
    title: string;
    description: string;
    badge: string;
}

interface AboutFeaturesProps {
    features: Feature[];
    featuresTitle: string;
    featuresTagline: string;
    isEditing?: boolean;
    onFeatureChange?: (index: number, field: string, value: string) => void;
    onFeaturesTitleChange?: (val: string) => void;
    onFeaturesTaglineChange?: (val: string) => void;
    onAddFeature?: () => void;
    onRemoveFeature?: (index: number) => void;
}

const IconRenderer = ({ name, className }: { name: string, className: string }) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} />;
};

export const AboutFeatures = ({
    features,
    featuresTitle,
    featuresTagline,
    isEditing,
    onFeatureChange,
    onFeaturesTitleChange,
    onFeaturesTaglineChange,
    onAddFeature,
    onRemoveFeature
}: AboutFeaturesProps) => {
    return (
        <section className={`py-32 relative`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20 space-y-4">
                    {isEditing ? (
                        <>
                            <input
                                value={featuresTitle}
                                onChange={(e) => onFeaturesTitleChange?.(e.target.value)}
                                className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight text-center w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-green-500/30 rounded-xl"
                                placeholder="Features Title..."
                            />
                            <input
                                value={featuresTagline}
                                onChange={(e) => onFeaturesTaglineChange?.(e.target.value)}
                                className="text-gray-500 font-medium uppercase tracking-widest text-sm text-center w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-green-500/30 rounded-xl"
                                placeholder="Features Tagline..."
                            />
                        </>
                    ) : (
                        <>
                            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">{featuresTitle}</h3>
                            <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">{featuresTagline}</p>
                        </>
                    )}
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-10 bg-white rounded-[2.5rem] border border-gray-100 hover:border-green-500/30 hover:shadow-[0_20px_60px_-15px_rgba(22,163,74,0.15)] transition-all duration-500 flex flex-col h-full text-left relative">
                            {isEditing && (
                                <button
                                    onClick={() => onRemoveFeature?.(idx)}
                                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <LucideIcons.Trash2 className="w-5 h-5" />
                                </button>
                            )}

                            <div className="mb-8 w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-green-50 group-hover:scale-110 transition-all duration-500 relative group/icon">
                                <IconRenderer name={feature.icon} className="w-8 h-8 text-gray-700 group-hover:text-green-600 transition-colors" />
                                {isEditing && (
                                    <input
                                        value={feature.icon}
                                        onChange={(e) => onFeatureChange?.(idx, 'icon', e.target.value)}
                                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/icon:opacity-100 transition-opacity w-20 text-center"
                                        placeholder="Icon name..."
                                    />
                                )}
                            </div>

                            {isEditing ? (
                                <input
                                    value={feature.title}
                                    onChange={(e) => onFeatureChange?.(idx, 'title', e.target.value)}
                                    className="text-2xl font-black text-gray-900 mb-4 tracking-tight bg-transparent border-none outline-none focus:ring-1 focus:ring-green-500/30 rounded p-1"
                                />
                            ) : (
                                <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.title}</h4>
                            )}

                            {isEditing ? (
                                <textarea
                                    value={feature.description}
                                    onChange={(e) => onFeatureChange?.(idx, 'description', e.target.value)}
                                    className="text-gray-600 leading-relaxed mb-6 flex-grow bg-transparent border-none outline-none focus:ring-1 focus:ring-green-500/30 rounded p-1 resize-none"
                                    rows={3}
                                />
                            ) : (
                                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                                    {feature.description}
                                </p>
                            )}

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                {isEditing ? (
                                    <input
                                        value={feature.badge}
                                        onChange={(e) => onFeatureChange?.(idx, 'badge', e.target.value)}
                                        className="text-xs font-black uppercase tracking-widest text-green-600 bg-transparent border-none outline-none focus:ring-1 focus:ring-green-500/30 rounded p-1 w-full"
                                    />
                                ) : (
                                    <span className="text-xs font-black uppercase tracking-widest text-green-600">{feature.badge}</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {isEditing && (
                        <button
                            onClick={onAddFeature}
                            className="p-10 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 hover:border-green-500/30 hover:bg-green-50 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-green-600 group"
                        >
                            <LucideIcons.Plus className="w-12 h-12 group-hover:scale-110 transition-transform" />
                            <span className="font-bold uppercase tracking-widest text-xs">Add New Feature</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};
