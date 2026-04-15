"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { defaultGripData } from '@/lib/gripData';
import { Save, AlertCircle, CheckCircle, Loader2, Plus, Trash2, Edit3, Undo2 } from 'lucide-react';

export default function GripContentEditor() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [data, setData] = useState<any>(defaultGripData);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/site-content?key=grip-programme');
            if (res.ok) {
                const dbData = await res.json();
                if (dbData && dbData.content) {
                    setData(JSON.parse(dbData.content));
                }
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            setMessage({ type: 'error', text: 'Failed to load content' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/site-content', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: 'grip-programme',
                    title: 'GRIP Programme Page',
                    content: JSON.stringify(data)
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'GRIP content updated successfully!' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const result = await res.json();
                throw new Error(result.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save changes' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (path: string[], value: any) => {
        setData((prev: any) => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                current[path[i]] = Array.isArray(current[path[i]]) ? [...current[path[i]]] : { ...current[path[i]] };
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newData;
        });
    };

    const saveHistory = (currentData: any) => {
        setHistory(prev => {
            const newHistory = [...prev, JSON.parse(JSON.stringify(currentData))];
            if (newHistory.length > 20) newHistory.shift(); 
            return newHistory;
        });
    };

    const handleUndo = () => {
        if (history.length > 0) {
            const previousState = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            setData(previousState);
            setMessage({ type: 'success', text: 'Action undone successfully.' });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleArrayAdd = (path: string[], emptyItem: any) => {
        saveHistory(data);
        setData((prev: any) => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < path.length; i++) {
                if (i === path.length - 1) {
                    current[path[i]] = [...current[path[i]], emptyItem];
                } else {
                    current[path[i]] = Array.isArray(current[path[i]]) ? [...current[path[i]]] : { ...current[path[i]] };
                    current = current[path[i]];
                }
            }
            return newData;
        });
    };

    const handleArrayRemove = (path: string[], index: number) => {
        saveHistory(data);
        setData((prev: any) => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < path.length; i++) {
                if (i === path.length - 1) {
                    const newArr = [...current[path[i]]];
                    newArr.splice(index, 1);
                    current[path[i]] = newArr;
                } else {
                    current[path[i]] = Array.isArray(current[path[i]]) ? [...current[path[i]]] : { ...current[path[i]] };
                    current = current[path[i]];
                }
            }
            return newData;
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
            {/* Header */}
            <div className="sticky top-4 z-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#008200] rounded-xl text-white">
                        <Edit3 className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">GRIP Page Editor</h1>
                        <p className="text-sm text-gray-500">Modify content for the GRIP Programme landing page.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {message && (
                        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 border ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                            <span className="font-bold text-xs">{message.text}</span>
                        </div>
                    )}
                    {history.length > 0 && (
                        <button
                            onClick={handleUndo}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            <Undo2 className="w-5 h-5" />
                            Undo 
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-[#008200] text-white font-bold rounded-xl hover:bg-[#006600] transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Publish Changes
                    </button>
                </div>
            </div>

            {/* Editor Sections */}
            <div className="space-y-8">
                
                {/* HERO SECTION */}
                <Section title="Hero Section">
                    <InputField label="Label" value={data.hero.label} onChange={(v) => handleChange(['hero', 'label'], v)} />
                    <InputField label="Title" value={data.hero.title} onChange={(v) => handleChange(['hero', 'title'], v)} />
                    <InputField label="Subtitle" value={data.hero.subtitle} onChange={(v) => handleChange(['hero', 'subtitle'], v)} />
                    <InputField label="Tagline" value={data.hero.tagline} onChange={(v) => handleChange(['hero', 'tagline'], v)} />
                    <TextAreaField label="Description" value={data.hero.description} onChange={(v) => handleChange(['hero', 'description'], v)} />
                    
                    <ArrayBlock title="Quick Stats">
                        {data.hero.stats.map((stat: any, i: number) => (
                            <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl">
                                <InputField label="Value" value={stat.value} onChange={(v) => handleChange(['hero', 'stats', i.toString(), 'value'], v)} className="flex-1" />
                                <InputField label="Label" value={stat.label} onChange={(v) => handleChange(['hero', 'stats', i.toString(), 'label'], v)} className="flex-1" />
                                <InputField label="Icon Name" value={stat.icon} onChange={(v) => handleChange(['hero', 'stats', i.toString(), 'icon'], v)} className="w-32" />
                                <button onClick={() => handleArrayRemove(['hero', 'stats'], i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"><Trash2 size={20} /></button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayAdd(['hero', 'stats'], { label: 'NEW STAT', value: '0', icon: 'Check' })} className="text-sm font-bold text-[#008200] flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Add Stat
                        </button>
                    </ArrayBlock>
                </Section>

                {/* WHO THIS IS FOR */}
                <Section title="Who This Is For">
                    <InputField label="Label" value={data.whoIsFor.label} onChange={(v) => handleChange(['whoIsFor', 'label'], v)} />
                    <InputField label="Title" value={data.whoIsFor.title} onChange={(v) => handleChange(['whoIsFor', 'title'], v)} />
                    <TextAreaField label="Subtitle" value={data.whoIsFor.subtitle} onChange={(v) => handleChange(['whoIsFor', 'subtitle'], v)} />
                    
                    <ArrayBlock title="Target Cards">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.whoIsFor.items.map((item: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl relative border border-gray-100">
                                    <button onClick={() => handleArrayRemove(['whoIsFor', 'items'], i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    <InputField label="Title" value={item.title} onChange={(v) => handleChange(['whoIsFor', 'items', i.toString(), 'title'], v)} />
                                    <InputField label="Icon" value={item.icon} onChange={(v) => handleChange(['whoIsFor', 'items', i.toString(), 'icon'], v)} />
                                    <TextAreaField label="Description" value={item.description} onChange={(v) => handleChange(['whoIsFor', 'items', i.toString(), 'description'], v)} />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleArrayAdd(['whoIsFor', 'items'], { title: 'New Target', description: 'Description...', icon: 'Users' })} className="text-sm font-bold text-[#008200] flex items-center gap-1 hover:underline mt-2">
                            <Plus size={16} /> Add Card
                        </button>
                    </ArrayBlock>
                </Section>

                {/* PROGRAMME */}
                <Section title="The Programme Section">
                    <InputField label="Label" value={data.programme.label} onChange={(v) => handleChange(['programme', 'label'], v)} />
                    <InputField label="Title" value={data.programme.title} onChange={(v) => handleChange(['programme', 'title'], v)} />
                    <TextAreaField label="Subtitle" value={data.programme.subtitle} onChange={(v) => handleChange(['programme', 'subtitle'], v)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 bg-gray-50 rounded-xl">
                        <InputField label="Dates" value={data.programme.info.dates} onChange={(v) => handleChange(['programme', 'info', 'dates'], v)} />
                        <InputField label="Location" value={data.programme.info.location} onChange={(v) => handleChange(['programme', 'info', 'location'], v)} />
                        <InputField label="Certificate" value={data.programme.info.certificate} onChange={(v) => handleChange(['programme', 'info', 'certificate'], v)} />
                        <InputField label="Cohort Size" value={data.programme.info.cohortSize} onChange={(v) => handleChange(['programme', 'info', 'cohortSize'], v)} />
                    </div>

                    <ArrayBlock title="Timeline">
                        {data.programme.timeline.map((item: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex gap-4 items-start">
                                <div className="flex-1 space-y-4">
                                    <div className="flex gap-4">
                                        <InputField label="Day" value={item.day} onChange={(v) => handleChange(['programme', 'timeline', i.toString(), 'day'], v)} className="w-32" />
                                        <InputField label="Title" value={item.title} onChange={(v) => handleChange(['programme', 'timeline', i.toString(), 'title'], v)} className="flex-1" />
                                        <InputField label="Subtitle" value={item.subtitle} onChange={(v) => handleChange(['programme', 'timeline', i.toString(), 'subtitle'], v)} className="flex-1" />
                                    </div>
                                    <TextAreaField label="Description" value={item.desc} onChange={(v) => handleChange(['programme', 'timeline', i.toString(), 'desc'], v)} />
                                    <InputField label="Features (comma-separated)" value={item.features.join(', ')} onChange={(v) => handleChange(['programme', 'timeline', i.toString(), 'features'], v.split(',').map((s: string) => s.trim()))} />
                                </div>
                                <button onClick={() => handleArrayRemove(['programme', 'timeline'], i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={20} /></button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayAdd(['programme', 'timeline'], { day: 'DAY X', title: 'New Day', subtitle: 'SUBTITLE', desc: 'Description...', features: [] })} className="text-sm font-bold text-[#008200] flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Add Day
                        </button>
                    </ArrayBlock>
                </Section>

                {/* MASTERCLASS */}
                <Section title="Masterclass Details">
                    <InputField label="Label" value={data.masterclass.label} onChange={(v) => handleChange(['masterclass', 'label'], v)} />
                    <InputField label="Title" value={data.masterclass.title} onChange={(v) => handleChange(['masterclass', 'title'], v)} />
                    <InputField label="Date Info" value={data.masterclass.dateInfo} onChange={(v) => handleChange(['masterclass', 'dateInfo'], v)} />
                    <TextAreaField label="Description" value={data.masterclass.description} onChange={(v) => handleChange(['masterclass', 'description'], v)} />
                    
                    <ArrayBlock title="Schedule Slots">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.masterclass.slots.map((item: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl relative border border-gray-100">
                                    <button onClick={() => handleArrayRemove(['masterclass', 'slots'], i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    <InputField label="Time" value={item.time} onChange={(v) => handleChange(['masterclass', 'slots', i.toString(), 'time'], v)} />
                                    <InputField label="Title" value={item.title} onChange={(v) => handleChange(['masterclass', 'slots', i.toString(), 'title'], v)} />
                                    <InputField label="Description" value={item.desc} onChange={(v) => handleChange(['masterclass', 'slots', i.toString(), 'desc'], v)} />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleArrayAdd(['masterclass', 'slots'], { time: '00:00 AM', title: 'New Slot', desc: '...' })} className="text-sm font-bold text-[#008200] flex items-center gap-1 hover:underline mt-2">
                            <Plus size={16} /> Add Slot
                        </button>
                    </ArrayBlock>
                </Section>

                {/* INVESTMENT */}
                <Section title="Investment Section">
                    <InputField label="Label" value={data.investment.label} onChange={(v) => handleChange(['investment', 'label'], v)} />
                    <InputField label="Title" value={data.investment.title} onChange={(v) => handleChange(['investment', 'title'], v)} />
                    <TextAreaField label="Subtitle" value={data.investment.subtitle} onChange={(v) => handleChange(['investment', 'subtitle'], v)} />
                    
                    <ArrayBlock title="Pricing Plans">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {data.investment.plans.map((item: any, i: number) => (
                                <div key={i} className="bg-gray-50 p-4 rounded-xl relative border border-gray-100">
                                    <button onClick={() => handleArrayRemove(['investment', 'plans'], i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    <div className="flex items-center gap-2 mb-4 mt-2">
                                        <input type="checkbox" checked={item.popular} onChange={(e) => handleChange(['investment', 'plans', i.toString(), 'popular'], e.target.checked)} />
                                        <label className="text-sm font-bold text-gray-700">Is Popular Tier</label>
                                    </div>
                                    <InputField label="Tier Name" value={item.tier} onChange={(v) => handleChange(['investment', 'plans', i.toString(), 'tier'], v)} />
                                    <InputField label="Price" value={item.price} onChange={(v) => handleChange(['investment', 'plans', i.toString(), 'price'], v)} />
                                    <TextAreaField label="Features (One per line)" value={item.features.join('\n')} onChange={(v) => handleChange(['investment', 'plans', i.toString(), 'features'], v.split('\n').map((s: string) => s.trim()).filter(Boolean))} />
                                </div>
                            ))}
                        </div>
                    </ArrayBlock>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                        <h4 className="font-bold text-gray-700">Flexible Payment Details</h4>
                        <InputField label="Title" value={data.investment.flexiblePayment.title} onChange={(v) => handleChange(['investment', 'flexiblePayment', 'title'], v)} />
                        <InputField label="Description" value={data.investment.flexiblePayment.desc} onChange={(v) => handleChange(['investment', 'flexiblePayment', 'desc'], v)} />
                        <InputField label="Footer Note" value={data.investment.flexiblePayment.footer} onChange={(v) => handleChange(['investment', 'flexiblePayment', 'footer'], v)} />
                    </div>
                </Section>

                {/* WHY STUDYEXPRESS */}
                <Section title="Why StudyExpress">
                    <InputField label="Label" value={data.whyStudyexpress.label} onChange={(v) => handleChange(['whyStudyexpress', 'label'], v)} />
                    <InputField label="Title" value={data.whyStudyexpress.title} onChange={(v) => handleChange(['whyStudyexpress', 'title'], v)} />
                    <TextAreaField label="Description (Paragraphs separated by newline)" value={data.whyStudyexpress.description.join('\n')} onChange={(v) => handleChange(['whyStudyexpress', 'description'], v.split('\n').filter(Boolean))} />
                    <TextAreaField label="Testimonial" value={data.whyStudyexpress.testimonial} onChange={(v) => handleChange(['whyStudyexpress', 'testimonial'], v)} />
                    
                    <ArrayBlock title="Stats">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.whyStudyexpress.stats.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl relative border border-gray-100">
                                    <button onClick={() => handleArrayRemove(['whyStudyexpress', 'stats'], i)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                    <InputField label="Value" value={item.value} onChange={(v) => handleChange(['whyStudyexpress', 'stats', i.toString(), 'value'], v)} className="flex-1" />
                                    <InputField label="Label" value={item.label} onChange={(v) => handleChange(['whyStudyexpress', 'stats', i.toString(), 'label'], v)} className="flex-1" />
                                </div>
                            ))}
                        </div>
                        <button onClick={() => handleArrayAdd(['whyStudyexpress', 'stats'], { value: '0', label: 'New Stat', icon: '' })} className="text-sm font-bold text-[#008200] flex items-center gap-1 hover:underline mt-2">
                            <Plus size={16} /> Add Stat
                        </button>
                    </ArrayBlock>
                </Section>

                {/* FAQ SECTION */}
                <Section title="FAQ Section">
                    <InputField label="Label" value={data.faq.label} onChange={(v) => handleChange(['faq', 'label'], v)} />
                    <InputField label="Title" value={data.faq.title} onChange={(v) => handleChange(['faq', 'title'], v)} />
                    
                    <ArrayBlock title="Questions">
                        {data.faq.items.map((item: any, i: number) => (
                            <div key={i} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl mb-4">
                                <div className="flex-1 space-y-2">
                                    <InputField label="Question" value={item.q} onChange={(v) => handleChange(['faq', 'items', i.toString(), 'q'], v)} />
                                    <TextAreaField label="Answer" value={item.a} onChange={(v) => handleChange(['faq', 'items', i.toString(), 'a'], v)} />
                                </div>
                                <button onClick={() => handleArrayRemove(['faq', 'items'], i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-6"><Trash2 size={20} /></button>
                            </div>
                        ))}
                        <button onClick={() => handleArrayAdd(['faq', 'items'], { q: 'Question?', a: 'Answer...' })} className="text-sm font-bold text-[#008200] flex items-center gap-1 hover:underline">
                            <Plus size={16} /> Add FAQ
                        </button>
                    </ArrayBlock>
                </Section>

                {/* CTA SECTION */}
                <Section title="Call to Action (Footer)">
                    <InputField label="Title" value={data.cta.title} onChange={(v) => handleChange(['cta', 'title'], v)} />
                    <TextAreaField label="Subtitle" value={data.cta.subtitle} onChange={(v) => handleChange(['cta', 'subtitle'], v)} />
                    <InputField label="Email Button Text" value={data.cta.emailText} onChange={(v) => handleChange(['cta', 'emailText'], v)} />
                    <InputField label="Email Link" value={data.cta.emailLink} onChange={(v) => handleChange(['cta', 'emailLink'], v)} />
                    <InputField label="Footer Note" value={data.cta.footer} onChange={(v) => handleChange(['cta', 'footer'], v)} />
                </Section>

            </div>
        </div>
    );
}

// Helper Components
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ArrayBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mt-6 border-t border-gray-100 pt-6">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">{title}</h4>
        {children}
    </div>
);

const InputField = ({ label, value, onChange, className = "" }: { label: string, value: string, onChange: (v: string) => void, className?: string }) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-sm font-medium text-gray-600 block">{label}</label>
        <input 
            type="text" 
            value={value || ''} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008200]/20 focus:border-[#008200] transition-colors"    
        />
    </div>
);

const TextAreaField = ({ label, value, onChange, className = "" }: { label: string, value: string, onChange: (v: string) => void, className?: string }) => {
    const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="text-sm font-medium text-gray-600 block">{label}</label>
            <textarea 
                value={value || ''} 
                onChange={(e) => {
                    onChange(e.target.value);
                    adjustHeight(e);
                }}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008200]/20 focus:border-[#008200] transition-colors min-h-[80px]"    
            />
        </div>
    );
};
