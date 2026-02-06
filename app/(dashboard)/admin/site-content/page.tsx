
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Save, AlertCircle, CheckCircle, Loader2, Image as ImageIcon, Plus, Trash2, Edit3, Type, Target, Layout } from 'lucide-react';

import { AboutHero } from '@/components/about/AboutHero';
import { AboutIntro } from '@/components/about/AboutIntro';
import { AboutMission } from '@/components/about/AboutMission';
import { AboutFeatures } from '@/components/about/AboutFeatures';
import { AboutStats } from '@/components/about/AboutStats';
import { AboutCTA } from '@/components/about/AboutCTA';

export default function SiteContentPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Core Fields
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tagline, setTagline] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [introduction, setIntroduction] = useState('');
    const [introTitle, setIntroTitle] = useState('');

    // Mission Fields
    const [missionTitle, setMissionTitle] = useState('');
    const [missionContent, setMissionContent] = useState('');
    const [missionImageUrl, setMissionImageUrl] = useState('');

    // CTA Fields
    const [ctaTitle, setCtaTitle] = useState('');
    const [ctaDescription, setCtaDescription] = useState('');
    const [ctaButtonText, setCtaButtonText] = useState('');

    // Features Header Fields
    const [featuresTitle, setFeaturesTitle] = useState('');
    const [featuresTagline, setFeaturesTagline] = useState('');
    const [features, setFeatures] = useState<any[]>([]);

    // Stats Fields
    const [stats, setStats] = useState<any[]>([]);

    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Auto-resize textarea logic
    const adjustHeight = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const res = await fetch('/api/site-content?key=about-us');
            if (res.ok) {
                const data = await res.json();

                // Mirror fallback logic from public About page
                setTitle(data.title || 'About Study Express UK');
                setTagline(data.tagline || 'Our Journey');
                setImageUrl(data.imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000');
                setHeroDescription(data.heroDescription || 'Bridging the gap between ambition and achievement through world-class education and innovation.');

                setIntroduction(data.introduction || 'Empowering learners worldwide with quality education and professional development opportunities.');
                setIntroTitle(data.introTitle || 'Study Express UK');

                setMissionTitle(data.missionTitle || 'Our Mission');
                setMissionContent(data.missionContent || 'To bridge the gap between ambition and achievement by providing accessible, high-quality courses and events that foster growth, connection, and success.');
                setMissionImageUrl(data.missionImageUrl || data.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=1000');

                setFeaturesTitle(data.featuresTitle || 'What We Offer');
                setFeaturesTagline(data.featuresTagline || 'Crafting excellence in every step');
                const defaultFeatures = [
                    { icon: 'BookOpen', title: 'Expert-Led Courses', description: 'Learn from industry professionals with real-world experience.', badge: 'Premium Quality' },
                    { icon: 'Calendar', title: 'Engaging Events', description: 'Connect with peers through immersive conferences.', badge: 'Immersive Experience' },
                    { icon: 'Users', title: 'Global Community', description: 'Join a diverse network of learners worldwide.', badge: 'Global Reach' }
                ];
                setFeatures(data.features?.length > 0 ? data.features : defaultFeatures);

                const defaultStats = [
                    { value: '10k+', label: 'Learners', color: 'text-green-600' },
                    { value: '500+', label: 'Courses', color: 'text-blue-600' },
                    { value: '50+', label: 'Partners', color: 'text-orange-500' }
                ];
                setStats(data.stats?.length > 0 ? data.stats : defaultStats);

                setCtaTitle(data.ctaTitle || 'Study Express UK is your partner in lifelong learning.');
                setCtaDescription(data.ctaDescription || "Whether you're looking to advance your career, learn a new skill, or connect with like-minded individuals, we are here for you.");
                setCtaButtonText(data.ctaButtonText || 'Get Started Now');
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
                    key: 'about-us',
                    title: title || 'About Study Express UK',
                    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000',
                    tagline: tagline || 'Our Journey',
                    heroDescription: heroDescription || 'Bridging the gap between ambition and achievement through world-class education and innovation.',
                    introduction: introduction || 'Empowering learners worldwide with quality education.',
                    introTitle: introTitle || 'Study Express UK',
                    missionTitle: missionTitle || 'Our Mission',
                    missionContent: missionContent || 'To bridge the gap between ambition and achievement.',
                    missionImageUrl: missionImageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=1000',
                    ctaTitle: ctaTitle || 'Study Express UK is your partner in lifelong learning.',
                    ctaDescription: ctaDescription || "Whether you're looking to advance your career, learn a new skill, or connect with like-minded individuals, we are here for you.",
                    ctaButtonText: ctaButtonText || 'Get Started Now',
                    featuresTitle: featuresTitle || 'What We Offer',
                    featuresTagline: featuresTagline || 'Crafting excellence in every step',
                    features: features.length > 0 ? features : [],
                    stats: stats.length > 0 ? stats : [],
                    content: introduction || missionContent || 'About Us Content'
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Site content updated successfully!' });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save changes' });
        } finally {
            setSaving(false);
        }
    };

    const addFeature = () => {
        setFeatures([...features, { icon: 'BookOpen', title: 'New Feature', description: 'Feature description goes here.', badge: 'EXCELLENCE' }]);
    };

    const removeFeature = (index: number) => {
        setFeatures(features.filter((_, i) => i !== index));
    };

    const updateFeature = (index: number, field: string, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeatures(newFeatures);
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...stats];
        newStats[index] = { ...newStats[index], [field]: value };
        setStats(newStats);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto py-8 px-4 space-y-6">
            {/* Direct Editor Header */}
            <div className="sticky top-4 z-[200] flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-2xl border border-white/40 ring-1 ring-black/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-600 rounded-2xl shadow-lg shadow-green-200">
                        <Edit3 className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Direct Site Editor</h1>
                        <p className="text-sm text-gray-500 font-medium italic flex items-center gap-2">
                            Click any text or image below to edit it directly.
                            <span className="flex items-center gap-1 text-green-600 ml-2">
                                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                                Live Sync Active
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {message && (
                        <div className={`px-4 py-2 rounded-xl flex items-center gap-2 border-2 ${message.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                            <span className="font-bold text-xs">{message.text}</span>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 px-10 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-200 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Publish Changes
                    </button>
                </div>
            </div>

            {/* Direct Editor Canvas */}
            <div className="relative bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-gray-900 overflow-hidden min-h-[80vh]">
                <div className="absolute top-0 left-0 right-0 bg-gray-900 text-white p-2 text-[10px] font-bold text-center z-[100] tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity">
                    Direct Edit Mode Enabled
                </div>

                <div className="h-full">
                    <AboutHero
                        title={title}
                        tagline={tagline}
                        imageUrl={imageUrl}
                        heroDescription={heroDescription}
                        isEditing
                        onTitleChange={setTitle}
                        onTaglineChange={setTagline}
                        onImageUrlChange={setImageUrl}
                        onHeroDescriptionChange={setHeroDescription}
                    />

                    <AboutStats
                        stats={stats}
                        isEditing
                        onStatChange={updateStat}
                    />

                    <AboutIntro
                        title={introTitle}
                        introduction={introduction}
                        isEditing
                        onTitleChange={setIntroTitle}
                        onIntroductionChange={setIntroduction}
                    />

                    <AboutMission
                        missionTitle={missionTitle}
                        missionContent={missionContent}
                        missionImageUrl={missionImageUrl}
                        isEditing
                        onMissionTitleChange={setMissionTitle}
                        onMissionContentChange={setMissionContent}
                        onMissionImageUrlChange={setMissionImageUrl}
                    />

                    <AboutFeatures
                        features={features}
                        featuresTitle={featuresTitle}
                        featuresTagline={featuresTagline}
                        isEditing
                        onFeatureChange={updateFeature}
                        onFeaturesTitleChange={setFeaturesTitle}
                        onFeaturesTaglineChange={setFeaturesTagline}
                        onAddFeature={addFeature}
                        onRemoveFeature={removeFeature}
                    />

                    <AboutCTA
                        ctaTitle={ctaTitle}
                        ctaDescription={ctaDescription}
                        ctaButtonText={ctaButtonText}
                        isEditing
                        onCtaTitleChange={setCtaTitle}
                        onCtaDescriptionChange={setCtaDescription}
                        onCtaButtonTextChange={setCtaButtonText}
                    />

                    <div className="py-20 bg-gray-900 text-center grayscale opacity-30">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Footer Preview Area</p>
                    </div>
                </div>
            </div>

            <div className="bg-yellow-400 text-black p-4 text-center font-black rounded-xl border-2 border-yellow-500 shadow-sm flex items-center justify-center gap-3">
                <AlertCircle className="w-6 h-6" />
                DIRECT EDITING ENGINE LOADED: SITE CONTENT IS NOW MUTATABLE ON-CLICK.
            </div>
        </div>
    );
}
