'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, Edit3, Eye, EyeOff, Check, X, Loader2, AlertCircle, 
  CheckCircle, Shield, UserPlus, Users, Activity, Lock, Mail,
  ChevronRight, Search, Filter, MoreVertical, ShieldCheck,
  UserCheck, ShieldAlert
} from 'lucide-react';

interface SubAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  permissionLevel: 'FULL_ADMIN' | 'CONTENT_ADMIN' | 'USER_ADMIN';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

const permissionLevels = [
  {
    value: 'FULL_ADMIN',
    label: 'Full Administrator',
    description: 'Total control over all platform modules including payments and system settings.',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
    icon: <ShieldAlert className="w-5 h-5" />
  },
  {
    value: 'CONTENT_ADMIN',
    label: 'Content Specialist',
    description: 'Permissions restricted to managing courses, events, and site-wide content.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    value: 'USER_ADMIN',
    label: 'Member Manager',
    description: 'Focuses on user management, memberships, and community communications.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    icon: <UserCheck className="w-5 h-5" />
  },
];

export default function SubAdminManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [fetchingSubAdmins, setFetchingSubAdmins] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    permissionLevel: 'USER_ADMIN',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      setFetchingSubAdmins(true);
      const response = await fetch('/api/subadmins');
      if (response.ok) {
        const data = await response.json();
        setSubAdmins(data.subAdmins || []);
      }
    } catch (err) {
      console.error('Failed to fetch sub-admins:', err);
      setError('Failed to load sub-admin accounts');
    } finally {
      setFetchingSubAdmins(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) return setError('First name is required'), false;
    if (!formData.lastName.trim()) return setError('Last name is required'), false;
    if (!formData.email.trim()) return setError('Email address is required'), false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Invalid email format'), false;
    if (!formData.password) return setError('Security password is required'), false;
    if (formData.password.length < 8) return setError('Password must be at least 8 characters'), false;
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match'), false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/subadmins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          permissionLevel: formData.permissionLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Identity creation failed');

      setSuccess('Sub-admin account provisioned successfully');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        permissionLevel: 'USER_ADMIN',
      });
      setShowModal(false);
      fetchSubAdmins();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/subadmins/${deleteTargetId}`, { method: 'DELETE' });
      if (response.ok) {
        setSuccess('Access revoked and account removed');
        fetchSubAdmins();
        setShowDeleteConfirm(false);
        setDeleteTargetId(null);
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError('Failed to deprovision account');
      }
    } catch (err) {
      setError('Communication error during removal');
    } finally {
      setDeleting(false);
    }
  };

  const filteredAdmins = subAdmins.filter(admin => 
    `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1600px] mx-auto pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
             <Shield className="w-10 h-10 text-[#008200]" />
             Identity Management
          </h1>
          <p className="text-gray-500 mt-2 text-lg font-medium max-w-2xl">
            Provision and govern delegated administrative access. Securely manage granular permissions for your staff.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#008200] transition-colors" />
              <input 
                type="text" 
                placeholder="Search administrators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white border border-gray-200 rounded-2xl w-full sm:w-80 shadow-sm focus:ring-4 focus:ring-[#008200]/5 focus:border-[#008200] transition-all font-medium"
              />
           </div>
           <button
             onClick={() => setShowModal(true)}
             className="bg-gray-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-gray-200 transition-all active:scale-95"
           >
             <UserPlus className="w-5 h-5" />
             Add Member
           </button>
        </div>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8 flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 px-6 py-4 rounded-2xl shadow-sm">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span className="font-bold">{success}</span>
          </motion.div>
        )}
        {error && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8 flex items-center gap-3 bg-red-50 border border-red-100 text-red-800 px-6 py-4 rounded-2xl shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Statistics Widgets */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatCard label="Total Staff" value={subAdmins.length} icon={<Users className="w-6 h-6" />} color="text-gray-900" />
           <StatCard label="Active Access" value={subAdmins.filter(s => s.isActive).length} icon={<Activity className="w-6 h-6" />} color="text-emerald-600" />
           <StatCard label="Security Clearances" value={subAdmins.filter(s => s.permissionLevel === 'FULL_ADMIN').length} icon={<Lock className="w-6 h-6" />} color="text-red-600" />
        </div>

        {/* List Sections */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[32px] shadow-xl shadow-gray-200/40 border border-gray-100 overflow-hidden">
              <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                 <h2 className="text-xl font-black text-gray-900">Registered Delegates</h2>
                 <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-900 transition-colors" />
              </div>

              <div className="p-4">
                 {fetchingSubAdmins ? (
                   <div className="flex flex-col items-center justify-center h-80 gap-4">
                      <Loader2 className="w-10 h-10 animate-spin text-[#008200]" />
                      <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Deciphering database...</p>
                   </div>
                 ) : filteredAdmins.length === 0 ? (
                   <div className="flex flex-col items-center justify-center p-20 text-center">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                         <Shield className="w-10 h-10 text-gray-200" />
                      </div>
                      <h3 className="text-xl font-black text-gray-900">No Administrators Found</h3>
                      <p className="text-gray-500 mt-2 max-w-xs mx-auto">Either the vault is empty or no members match your active search filters.</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 gap-4">
                     {filteredAdmins.map((admin) => {
                       const perm = permissionLevels.find(p => p.value === admin.permissionLevel);
                       return (
                         <motion.div 
                           key={admin.id} 
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="group flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 bg-white hover:bg-gray-50 border border-gray-100 rounded-3xl transition-all duration-300 relative overflow-hidden"
                         >
                           {/* Avatar Badge */}
                           <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200 rounded-2xl flex items-center justify-center text-xl font-black shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                              {admin.firstName[0]}{admin.lastName[0]}
                           </div>

                           {/* Info */}
                           <div className="flex-1 min-w-0">
                             <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h4 className="text-lg font-black text-gray-900 tracking-tight">{admin.firstName} {admin.lastName}</h4>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${perm?.bg} ${perm?.color} border ${perm?.border}`}>
                                   {perm?.icon}
                                   {perm?.label}
                                </div>
                             </div>
                             <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {admin.email}</span>
                                <span className="hidden sm:inline w-1 h-1 bg-gray-300 rounded-full" />
                                <span>Access granted {new Date(admin.createdAt).toLocaleDateString()}</span>
                             </div>
                           </div>

                             {/* Actions */}
                             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-3 hover:bg-white hover:shadow-lg rounded-xl text-gray-400 hover:text-[#008200] transition-all"><Edit3 className="w-5 h-5" /></button>
                                <button onClick={() => { setDeleteTargetId(admin.id); setShowDeleteConfirm(true); }} className="p-3 hover:bg-white hover:shadow-lg rounded-xl text-gray-400 hover:text-red-600 transition-all"><Trash2 className="w-5 h-5" /></button>
                             </div>
                         </motion.div>
                       );
                     })}
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Permission Legend Sidebar */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl shadow-gray-200">
              <h2 className="text-xl font-black mb-2 flex items-center gap-2">
                 <Lock className="w-5 h-5 text-[#008200]" />
                 Access Levels
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-8">Platform permissions guide.</p>
              
              <div className="space-y-6">
                {permissionLevels.map(level => (
                  <div key={level.value} className="relative group">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                       <div className={`p-2.5 rounded-xl ${level.bg} ${level.color}`}>
                          {level.icon}
                       </div>
                       <div>
                          <p className="font-black text-sm">{level.label}</p>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">{level.description}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="bg-[#008200]/5 border border-[#008200]/10 rounded-[32px] p-8">
              <h4 className="font-black text-[#008200] text-lg mb-2">Security Advice</h4>
              <p className="text-[#008200]/80 text-sm leading-relaxed font-medium">
                 Always provision the least privilege required for a role. Avoid granting "Full Administrator" unless absolutely necessary for system maintenance.
              </p>
           </div>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               exit={{ scale: 0.9, opacity: 0, y: 30 }} 
               className="relative bg-white rounded-[40px] shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100"
            >
              {/* Modal Header */}
              <div className="bg-gray-900 px-10 py-12 text-white relative">
                <Shield className="w-16 h-16 text-[#008200] mb-4 opacity-50 absolute -right-4 -top-4 rotate-12" />
                <h2 className="text-3xl font-black tracking-tight">Provision Identity</h2>
                <p className="text-gray-400 mt-2 font-medium">Issue high-level administrative credentials.</p>
              </div>

              <form onSubmit={handleSubmit} className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" name="firstName" placeholder="Alex" value={formData.firstName} onChange={handleInputChange} />
                  <Input label="Last Name" name="lastName" placeholder="Carter" value={formData.lastName} onChange={handleInputChange} />
                </div>
                <Input label="Email Address" type="email" name="email" placeholder="alex@studyexpress.com" value={formData.email} onChange={handleInputChange} />
                
                <div className="space-y-2">
                   <label className="text-sm font-black text-gray-700">Security Clearance</label>
                   <select 
                     name="permissionLevel" 
                     value={formData.permissionLevel} 
                     onChange={handleInputChange}
                     className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#008200]/10 focus:border-[#008200] transition-all font-bold text-sm appearance-none"
                   >
                     {permissionLevels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                   </select>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <Input label="Secret Key" type={showPassword ? 'text' : 'password'} name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 bottom-4 text-gray-400 hover:text-gray-600 transition-colors">
                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <Input label="Verify Key" type={showPassword ? 'text' : 'password'} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} />
                </div>

                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-black transition-all">Discard</button>
                   <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#008200] hover:bg-[#006600] text-white rounded-2xl font-black transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
                      {loading ? 'Processing...' : 'Provision'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
           <div className="fixed inset-0 flex items-center justify-center z-[110] p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl">
                 <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900">Revoke Access?</h2>
                 <p className="text-gray-500 mt-2 font-medium">This identity will be permanently deprovisioned and all administrative tokens revoked.</p>
                 <div className="flex flex-col gap-3 mt-8">
                    <button onClick={handleDelete} disabled={deleting} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-2">
                       {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                       {deleting ? 'Deprovisioning...' : 'Yes, Revoke Access'}
                    </button>
                    <button onClick={() => setShowDeleteConfirm(false)} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-2xl font-black transition-all">Cancel</button>
                 </div>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/40 flex items-center justify-between">
       <div>
          <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-4xl font-black ${color}`}>{value}</p>
       </div>
       <div className={`p-4 bg-gray-50 rounded-2xl ${color}`}>
          {icon}
       </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2">
       <label className="text-sm font-black text-gray-700">{label}</label>
       <input 
         {...props}
         className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#008200]/10 focus:border-[#008200] focus:bg-white transition-all font-medium text-gray-900 placeholder:text-gray-300" 
       />
    </div>
  );
}
