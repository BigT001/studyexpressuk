'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, Mail, Trash2, Clock, CheckCircle, AlertTriangle, 
  Info, Users, Send, AlertCircle, Loader2, Calendar
} from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'urgent';
  targetAudience: 'all' | 'students' | 'corporate' | 'subadmin';
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

interface EmailNotification {
  _id: string;
  subject: string;
  htmlContent: string;
  recipients: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  successCount?: number;
  failedCount?: number;
  sentAt: string;
}

export default function CommunicationsPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [emails, setEmails] = useState<EmailNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    targetAudience: 'all' as const,
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    subject: '',
    htmlContent: '',
    recipients: ['all'],
  });

  const [savingAnnouncement, setSavingAnnouncement] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [announcementsRes, emailsRes] = await Promise.all([
        fetch('/api/announcements'),
        fetch('/api/emails'),
      ]);

      if (announcementsRes.ok) {
        const data = await announcementsRes.json();
        setAnnouncements(data.announcements || []);
      }
      if (emailsRes.ok) {
        const data = await emailsRes.json();
        setEmails(data.emails || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAnnouncement(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announcementForm),
      });
      if (res.ok) {
        const data = await res.json();
        setAnnouncements([data.announcement, ...announcements]);
        setAnnouncementForm({
          title: '',
          content: '',
          type: 'info',
          targetAudience: 'all',
        });
      } else {
         setError('Failed to create announcement');
      }
    } catch (err) {
      setError('An error occurred while creating announcement');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      const res = await fetch('/api/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm),
      });
      if (res.ok) {
        const data = await res.json();
        setEmails([data.email, ...emails]);
        setEmailForm({
          subject: '',
          htmlContent: '',
          recipients: ['all'],
        });
      } else {
        setError('Failed to send email');
      }
    } catch (err) {
      setError('An error occurred while sending email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this announcement?')) return;
    try {
      const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAnnouncements(announcements.filter(a => a._id !== id));
      }
    } catch (err) {
      setError('Failed to delete announcement');
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (!confirm('Are you sure you want to delete this email record?')) return;
    try {
      const res = await fetch(`/api/emails/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmails(emails.filter(e => e._id !== id));
      }
    } catch (err) {
      setError('Failed to delete email');
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return { 
           bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200',
           icon: <AlertTriangle className="w-5 h-5 text-red-500" />
        };
      case 'warning':
        return { 
           bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200',
           icon: <AlertCircle className="w-5 h-5 text-orange-500" />
        };
      case 'success':
        return { 
           bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',
           icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
        };
      default:
        return { 
           bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200',
           icon: <Info className="w-5 h-5 text-blue-500" />
        };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'sending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Communications Center</h1>
        <p className="text-gray-500 mt-2 text-lg">Broadcast rich announcements and manage platform notifications instantly.</p>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-red-50 flex items-start gap-3 border border-red-200 text-red-700 p-4 rounded-xl shadow-sm">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="font-medium text-sm">{error}</p>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 bg-gray-100/80 rounded-2xl w-fit mb-8 shadow-inner border border-gray-200/60 backdrop-blur-sm">
        <button
          onClick={() => setSelectedTab(0)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            selectedTab === 0
              ? 'bg-white text-[#008200] shadow-sm ring-1 ring-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          Broadcasts
        </button>
        <button
          onClick={() => setSelectedTab(1)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            selectedTab === 1
              ? 'bg-white text-[#008200] shadow-sm ring-1 ring-gray-200'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email Campaigns
        </button>
      </div>

      {/* Tab Contents */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* ======================= BROADCASTS TAB ======================= */}
        {selectedTab === 0 && (
          <>
            {/* Editor Side */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-12 2xl:col-span-5 flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-[#008200] to-[#00B300] rounded-xl shadow-lg shadow-green-200">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">New Broadcast</h3>
                    <p className="text-gray-500 text-sm font-medium">Draft a new platform-wide announcement.</p>
                  </div>
                </div>

                <form onSubmit={handleCreateAnnouncement} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Headline</label>
                    <input
                      type="text"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      required
                      placeholder="E.g., System Maintenance Upcoming"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008200]/10 focus:border-[#008200] focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Urgency Type</label>
                      <select
                        value={announcementForm.type}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value as any })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008200]/10 focus:border-[#008200] focus:bg-white transition-all font-medium appearance-none"
                      >
                        <option value="info">ℹ️ Information</option>
                        <option value="success">✅ Success</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="urgent">🚨 Urgent (Red)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Audience Group</label>
                      <select
                        value={announcementForm.targetAudience}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, targetAudience: e.target.value as any })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008200]/10 focus:border-[#008200] focus:bg-white transition-all font-medium appearance-none"
                      >
                        <option value="all">👥 All Users</option>
                        <option value="students">🎓 Students Only</option>
                        <option value="corporate">🏢 Corporates Only</option>
                        <option value="subadmin">👤 Sub-Admins</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Message Body</label>
                    <textarea
                      value={announcementForm.content}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                      required
                      rows={5}
                      placeholder="Write your announcement message here..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#008200]/10 focus:border-[#008200] focus:bg-white transition-all resize-none font-medium text-gray-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingAnnouncement}
                    className="w-full relative group overflow-hidden bg-gray-900 border border-transparent hover:bg-gray-800 text-white rounded-xl px-6 py-4 font-black transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {savingAnnouncement ? <Loader2 className="w-5 h-5 animate-spin" /> : <Megaphone className="w-5 h-5" />}
                    <span>{savingAnnouncement ? 'Publishing...' : 'Publish Broadcast'}</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* List Side */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="xl:col-span-12 2xl:col-span-7">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col h-[800px] overflow-hidden">
                <div className="p-8 pb-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Broadcasts</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Live announcements displayed across the platform.</p>
                  </div>
                  <div className="p-2.5 bg-gray-50 text-gray-400 rounded-lg">
                     <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gray-50/50">
                  <AnimatePresence>
                    {loading ? (
                      <div className="h-full flex items-center justify-center">
                         <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                      </div>
                    ) : announcements.length === 0 ? (
                      <motion.div initial={{ opacity:0 }} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-200 border-dashed rounded-2xl">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                           <Megaphone className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">No active broadcasts</h4>
                        <p className="text-gray-500 text-sm max-w-sm mt-1">Announcements created will appear here and on the user dashboard immediately.</p>
                      </motion.div>
                    ) : (
                      announcements.map((ann) => {
                        const style = getTypeStyle(ann.type);
                        return (
                          <motion.div
                            key={ann._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md group relative"
                          >
                            <div className="flex items-start gap-4">
                              {/* Icon Badge */}
                              <div className={`p-3 rounded-xl shrink-0 ${style.bg} border ${style.border}`}>
                                 {style.icon}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4 mb-2">
                                  <h4 className="text-lg font-extrabold text-gray-900 truncate">{ann.title}</h4>
                                  <button
                                    onClick={() => handleDeleteAnnouncement(ann._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                    title="Revoke Announcement"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                                
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{ann.content}</p>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                                    <Users className="w-3.5 h-3.5 text-gray-500" />
                                    {ann.targetAudience.charAt(0).toUpperCase() + ann.targetAudience.slice(1)}
                                  </span>
                                  <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-lg border border-gray-100">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* ======================= EMAILS TAB ======================= */}
        {selectedTab === 1 && (
          <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-lg shadow-indigo-200">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Email Campaign</h3>
                    <p className="text-gray-500 text-sm font-medium">Send responsive HTML emails to user groups.</p>
                  </div>
                </div>

                <form onSubmit={handleSendEmail} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Subject Line</label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      required
                      placeholder="Exciting News from StudyExpress"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Recipient Audience</label>
                    <select
                      value={emailForm.recipients[0] || 'all'}
                      onChange={(e) => setEmailForm({ ...emailForm, recipients: [e.target.value] })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white transition-all font-medium appearance-none"
                    >
                      <option value="all">👥 Everyone</option>
                      <option value="students">🎓 Students</option>
                      <option value="corporate">🏢 Corporate Partners</option>
                      <option value="subadmin">👤 Sub-Admins</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                       <label className="text-sm font-bold text-gray-700">HTML Content</label>
                       <span className="text-xs font-medium text-gray-400">Supports raw HTML syntax</span>
                    </div>
                    <textarea
                      value={emailForm.htmlContent}
                      onChange={(e) => setEmailForm({ ...emailForm, htmlContent: e.target.value })}
                      required
                      rows={8}
                      placeholder="<h1>Title</h1><p>Your beautiful email content goes here...</p>"
                      className="w-full px-4 py-3 bg-gray-900 text-green-400 border-none rounded-xl focus:ring-4 focus:ring-indigo-100 focus:bg-gray-800 transition-all font-mono text-sm leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="w-full relative group overflow-hidden bg-indigo-600 border border-transparent hover:bg-indigo-700 text-white rounded-xl px-6 py-4 font-black transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2 shadow-lg shadow-indigo-200"
                  >
                    {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span>{sendingEmail ? 'Dispatching Campaign...' : 'Launch Email Campaign'}</span>
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Email History */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-6">
               <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col h-[750px] overflow-hidden">
                  <div className="p-8 pb-4 border-b border-gray-100 bg-white shrink-0">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Campaign History</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Logs of recently deployed emails.</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-gray-50/50">
                     <AnimatePresence>
                       {loading ? (
                         <div className="h-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                         </div>
                       ) : emails.length === 0 ? (
                         <motion.div initial={{ opacity:0 }} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center text-center p-8 bg-white border border-gray-200 border-dashed rounded-2xl">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <Mail className="w-8 h-8 text-gray-300" />
                           </div>
                           <h4 className="text-lg font-bold text-gray-900">No campaigns launched</h4>
                           <p className="text-gray-500 text-sm max-w-sm mt-1">Dispatched emails will show tracking metrics here.</p>
                         </motion.div>
                       ) : (
                         emails.map(email => (
                            <motion.div
                               key={email._id}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                            >
                               <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1 min-w-0">
                                     <h4 className="font-extrabold text-gray-900 truncate mb-1 text-lg">{email.subject}</h4>
                                     <p className="text-gray-500 text-xs mb-3 font-medium">To: {email.recipients.join(', ').toUpperCase()}</p>
                                     <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${getStatusColor(email.status)} uppercase tracking-wide`}>
                                           {email.status}
                                        </span>
                                        {email.status === 'sent' && (
                                           <span className="text-xs font-bold px-2.5 py-1 bg-green-50 text-emerald-700 border border-emerald-200 rounded-md">
                                              👍 {email.successCount || 0} Deliv.
                                           </span>
                                        )}
                                     </div>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteEmail(email._id)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Log"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                               </div>
                            </motion.div>
                         ))
                       )}
                     </AnimatePresence>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
