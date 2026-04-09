'use client';

import React, { useEffect, useState } from 'react';
import { Save, RotateCcw, AlertCircle, CheckCircle, Loader, Settings, Users, Shield, Zap, Mail, AlertTriangle, MessageSquare } from 'lucide-react';

interface SystemSettings {
  // Registration
  allowIndividualRegistration: boolean;
  allowCorporateRegistration: boolean;
  requireEmailVerification: boolean;
  
  // Security
  enforce2FAForAdmins: boolean;
  passwordExpiryDays: number;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  
  // Email Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  emailFromName: string;
  emailFromAddress: string;
  
  // Payment & Billing
  stripeEnabled: boolean;
  taxRate: number;
  
  // System
  maintenanceMode: boolean;
  maintenanceMessage: string;
  
  // Features
  enableMessaging: boolean;
  enableAnalytics: boolean;
  enableCertificates: boolean;
  enableEventNotifications: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    allowIndividualRegistration: true,
    allowCorporateRegistration: true,
    requireEmailVerification: true,
    enforce2FAForAdmins: true,
    passwordExpiryDays: 90,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@studyexpressuk.com',
    emailFromName: 'Study Express UK',
    emailFromAddress: 'noreply@studyexpressuk.com',
    stripeEnabled: true,
    taxRate: 0,
    maintenanceMode: false,
    maintenanceMessage: '',
    enableMessaging: true,
    enableAnalytics: true,
    enableCertificates: true,
    enableEventNotifications: true,
  });

  const [originalSettings, setOriginalSettings] = useState<SystemSettings>(settings);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings || settings);
        setOriginalSettings(data.settings || settings);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setOriginalSettings(settings);
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save settings' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setMessage(null);
  };

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#008200] to-teal-700 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight">System Configuration</h1>
            <p className="text- green-100 font-medium text-lg mt-2 opacity-90 max-w-xl">
              Manage core platform behaviors, security rules, compliance boundaries, and email integration parameters.
            </p>
          </div>
          <div className="hidden lg:block bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/20">
            <Settings className="w-12 h-12 opacity-80" />
          </div>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className={`flex items-center gap-4 px-6 py-5 rounded-2xl shadow-lg animate-in slide-in-from-top-4 ${
          message.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-900 border border-emerald-200'
            : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-900 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          )}
          <span className="font-bold text-lg">{message.text}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Registration Settings */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-700">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Access Control</h2>
          </div>
          
          <div className="space-y-4 flex-1">
            <label className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
              <div>
                <p className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">Individual Signup Route</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Open platform registration for standard users</p>
              </div>
              <div className="relative inline-flex items-center">
                <input type="checkbox" checked={settings.allowIndividualRegistration} onChange={(e) => handleChange('allowIndividualRegistration', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008200]"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
              <div>
                <p className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">Corporate Org Creation</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Permit enterprises to instantiate bulk learning accounts</p>
              </div>
              <div className="relative inline-flex items-center">
                <input type="checkbox" checked={settings.allowCorporateRegistration} onChange={(e) => handleChange('allowCorporateRegistration', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008200]"></div>
              </div>
            </label>

            <label className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group">
              <div>
                <p className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">Enforce Identity Check</p>
                <p className="text-sm font-medium text-gray-500 mt-1">Require strict email verification before login gate</p>
              </div>
              <div className="relative inline-flex items-center">
                <input type="checkbox" checked={settings.requireEmailVerification} onChange={(e) => handleChange('requireEmailVerification', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#008200]"></div>
              </div>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="bg-red-100 p-3 rounded-xl text-red-700">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Security Parameters</h2>
          </div>
          
          <div className="space-y-6 flex-1">
            <label className="flex items-center justify-between p-5 bg-gradient-to-r from-red-50 to-white rounded-2xl border border-red-100 cursor-pointer hover:shadow-md transition-all">
              <div>
                <p className="font-bold text-red-900 text-lg">Enforce 2FA for Admins</p>
                <p className="text-sm font-medium text-red-700/80 mt-1">Strict requirement for two-factor authentication</p>
              </div>
              <div className="relative inline-flex items-center">
                <input type="checkbox" checked={settings.enforce2FAForAdmins} onChange={(e) => handleChange('enforce2FAForAdmins', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </div>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                <label className="block">
                  <p className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">Password TTL (Days)</p>
                  <input type="number" min="0" max="365" value={settings.passwordExpiryDays} onChange={(e) => handleChange('passwordExpiryDays', parseInt(e.target.value))} className="w-full text-2xl font-black bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-300" />
                  <p className="text-xs font-bold text-gray-400 mt-2">0 disables force-reset</p>
                </label>
              </div>
              <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white transition-colors">
                <label className="block">
                  <p className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">Idle Timeout (Min)</p>
                  <input type="number" min="5" max="1440" value={settings.sessionTimeoutMinutes} onChange={(e) => handleChange('sessionTimeoutMinutes', parseInt(e.target.value))} className="w-full text-2xl font-black bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-300" />
                  <p className="text-xs font-bold text-gray-400 mt-2">Auto-shred session bounds</p>
                </label>
              </div>
              <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white transition-colors md:col-span-2">
                <label className="block">
                  <p className="font-bold text-gray-900 text-sm mb-3 uppercase tracking-wider">Max Failed Logins</p>
                  <input type="number" min="1" max="10" value={settings.maxLoginAttempts} onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))} className="w-full text-2xl font-black bg-transparent border-none p-0 focus:ring-0 text-gray-900 placeholder-gray-300" />
                  <p className="text-xs font-bold text-gray-400 mt-2">Triggers IP/UID temporary ban</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Switches */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 xl:col-span-2">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-700">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Module Dispatch</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <label className="flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all text-center">
              <div className="relative inline-flex items-center mb-4">
                <input type="checkbox" checked={settings.enableMessaging} onChange={(e) => handleChange('enableMessaging', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <p className="font-black text-gray-900 text-lg mb-1">Direct Messaging</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">User Intranets</p>
            </label>

            <label className="flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all text-center">
              <div className="relative inline-flex items-center mb-4">
                <input type="checkbox" checked={settings.enableAnalytics} onChange={(e) => handleChange('enableAnalytics', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <p className="font-black text-gray-900 text-lg mb-1">Business Intel</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Analytics Dash</p>
            </label>

            <label className="flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all text-center">
              <div className="relative inline-flex items-center mb-4">
                <input type="checkbox" checked={settings.enableCertificates} onChange={(e) => handleChange('enableCertificates', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <p className="font-black text-gray-900 text-lg mb-1">Certificates</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Auto PDF Gen</p>
            </label>

            <label className="flex flex-col items-center justify-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100 cursor-pointer hover:border-indigo-300 hover:shadow-lg transition-all text-center">
              <div className="relative inline-flex items-center mb-4">
                <input type="checkbox" checked={settings.enableEventNotifications} onChange={(e) => handleChange('enableEventNotifications', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <p className="font-black text-gray-900 text-lg mb-1">Event Push</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">RSVP Rules</p>
            </label>
          </div>
        </div>

        {/* Email & External Providers */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 xl:col-span-2">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="bg-purple-100 p-3 rounded-xl text-purple-700">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Communication Transport</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white hover:shadow-md transition-all">
              <label className="block">
                <p className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wide">SMTP Target</p>
                <input type="text" value={settings.smtpHost} onChange={(e) => handleChange('smtpHost', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 font-medium" />
              </label>
            </div>
            
            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white hover:shadow-md transition-all">
              <label className="block">
                <p className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wide">SMTP Socket</p>
                <input type="number" value={settings.smtpPort} onChange={(e) => handleChange('smtpPort', parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 font-medium font-mono" />
              </label>
            </div>
            
            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white hover:shadow-md transition-all">
              <label className="block">
                <p className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wide">Relay ID</p>
                <input type="text" value={settings.smtpUsername} onChange={(e) => handleChange('smtpUsername', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 font-medium" />
              </label>
            </div>
            
            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white hover:shadow-md transition-all lg:col-span-1">
              <label className="block">
                <p className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wide">From Alias</p>
                <input type="text" value={settings.emailFromName} onChange={(e) => handleChange('emailFromName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 font-medium" />
              </label>
            </div>
            
            <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-100 focus-within:border-gray-400 focus-within:bg-white hover:shadow-md transition-all lg:col-span-2">
              <label className="block">
                <p className="font-bold text-gray-900 text-sm mb-2 uppercase tracking-wide">Origin Signature (Email)</p>
                <input type="email" value={settings.emailFromAddress} onChange={(e) => handleChange('emailFromAddress', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-800 font-medium font-mono" />
              </label>
            </div>
          </div>
        </div>

        {/* Global Overrides */}
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-xl shadow-amber-900/5 xl:col-span-2 bg-gradient-to-b from-amber-50/30 to-white">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Danger Zone</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm flex justify-between items-center">
              <div>
                <p className="font-black text-gray-900 text-xl border-l-4 border-amber-500 pl-3">Maintenance Lockout</p>
                <p className="text-sm font-bold text-gray-500 tracking-wide mt-2">Divert all external traffic to "Under Construction"</p>
              </div>
              <div className="relative inline-flex items-center scale-125 mx-4">
                <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => handleChange('maintenanceMode', e.target.checked)} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </div>
            </div>

            {settings.maintenanceMode ? (
              <div className="p-6 bg-white rounded-2xl border border-amber-300 shadow-inner animate-in zoom-in-95">
                <label className="block">
                  <p className="font-bold text-amber-900 text-sm mb-3 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4"/> Lockout Billboard Message
                  </p>
                  <textarea value={settings.maintenanceMessage} onChange={(e) => handleChange('maintenanceMessage', e.target.value)} placeholder="System upgrades in progress. We'll be back online in 2 hours." rows={3} className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-gray-800 font-medium bg-amber-50/50 resize-none" />
                </label>
              </div>
            ) : (
               <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center opacity-50">
                  <p className="text-gray-400 font-bold tracking-widest uppercase">System Online & Active</p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 transition-transform duration-500 xl:left-64">
        <div className="max-w-5xl mx-auto flex gap-4 lg:justify-end">
          <button onClick={handleReset} disabled={!hasChanges} className={`flex-1 lg:flex-none px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 ${
              hasChanges
                ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-200 shadow-sm'
                : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-50'
            }`}>
            <RotateCcw className="w-5 h-5 shrink-0" />
            <span>Abandon Changes</span>
          </button>
          
          <button onClick={handleSave} disabled={!hasChanges || saving} className={`flex-1 lg:flex-none px-12 py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all duration-300 ${
              hasChanges && !saving
                ? 'bg-gradient-to-r from-[#008200] to-teal-600 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1'
                : 'bg-gray-100 text-gray-400 border border-gray-100 cursor-not-allowed opacity-50'
            }`}>
            {saving ? <Loader className="w-5 h-5 animate-spin shrink-0" /> : <Save className="w-5 h-5 shrink-0" />}
            <span>{saving ? 'Committing...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
