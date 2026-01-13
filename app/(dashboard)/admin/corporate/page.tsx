'use client';

import { useState, useEffect } from 'react';

interface CorporateProfile {
  _id: string;
  ownerId: string;
  companyName: string;
  registrationNumber?: string;
  industry?: string;
  country?: string;
  state?: string;
  email?: string;
  phone?: string;
  website?: string;
  status: 'subscribed' | 'not-subscribed';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  staffCount?: number;
  createdAt: string;
}

export default function CorporateManagementPage() {
  const [corporates, setCorporates] = useState<CorporateProfile[]>([]);
  const [filteredCorporates, setFilteredCorporates] = useState<CorporateProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVerification, setFilterVerification] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCorporate, setSelectedCorporate] = useState<CorporateProfile | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const stats = {
    total: corporates.length,
    subscribed: corporates.filter(c => c.status === 'subscribed').length,
    notSubscribed: corporates.filter(c => c.status === 'not-subscribed').length,
    verified: corporates.filter(c => c.verificationStatus === 'verified').length,
    pending: corporates.filter(c => c.verificationStatus === 'pending').length,
  };

  // Fetch corporates from API
  useEffect(() => {
    const fetchCorporates = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/corporates?limit=1000');
        if (!response.ok) throw new Error('Failed to fetch corporate accounts');
        const data = await response.json();
        setCorporates(data.corporates || []);
        setError('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load corporate accounts');
        setCorporates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCorporates();
  }, []);

  // Filter corporates based on search and filters
  useEffect(() => {
    let filtered = corporates;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.registrationNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    // Verification filter
    if (filterVerification !== 'all') {
      filtered = filtered.filter(c => c.verificationStatus === filterVerification);
    }

    setFilteredCorporates(filtered);
  }, [corporates, searchTerm, filterStatus, filterVerification]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      subscribed: 'bg-green-100 text-green-800',
      'not-subscribed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      subscribed: 'Subscribed',
      'not-subscribed': 'Not Subscribed',
    };
    return labels[status] || status;
  };

  const getVerificationColor = (status: string) => {
    const colors: Record<string, string> = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getVerificationLabel = (status: string) => {
    const labels: Record<string, string> = {
      verified: 'Verified',
      pending: 'Pending',
      rejected: 'Rejected',
    };
    return labels[status] || status;
  };

  const handleStatusChange = async (corporateId: string, newStatus: string) => {
    try {
      setActionLoading(true);
      setActionError('');
      
      const response = await fetch(`/api/corporates/${corporateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update corporate status');
      
      const newStatusTyped = newStatus as 'subscribed' | 'not-subscribed';
      setCorporates(corporates.map(c => c._id === corporateId ? { ...c, status: newStatusTyped } : c));
      setSelectedCorporate(prev => prev?._id === corporateId ? { ...prev, status: newStatusTyped } : prev);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update corporate');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerificationChange = async (corporateId: string, newVerification: string) => {
    try {
      setActionLoading(true);
      setActionError('');
      
      const response = await fetch(`/api/corporates/${corporateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: newVerification }),
      });

      if (!response.ok) throw new Error('Failed to update verification status');
      
      const newVerificationTyped = newVerification as 'pending' | 'verified' | 'rejected';
      setCorporates(corporates.map(c => c._id === corporateId ? { ...c, verificationStatus: newVerificationTyped } : c));
      setSelectedCorporate(prev => prev?._id === corporateId ? { ...prev, verificationStatus: newVerificationTyped } : prev);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update verification');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Corporate Management</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Manage corporate accounts and subscriptions</p>
          </div>
          <input
            type="search"
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
        </div>

        {/* Stats Cards - All in one row, responsive */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-blue-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Total Companies</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mt-1 sm:mt-2">{stats.total}</p>
          </div>
          <div className="bg-linear-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-green-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Subscribed</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{stats.subscribed}</p>
          </div>
          <div className="bg-linear-to-br from-red-50 to-red-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-red-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Not Subscribed</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{stats.notSubscribed}</p>
          </div>
          <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-emerald-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Verified</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600 mt-1 sm:mt-2">{stats.verified}</p>
          </div>
          <div className="bg-linear-to-br from-amber-50 to-amber-100 rounded-lg p-3 sm:p-4 md:p-6 border-l-4 border-amber-600">
            <p className="text-xs sm:text-xs md:text-sm text-gray-600 font-medium truncate">Pending Verification</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-600 mt-1 sm:mt-2">{stats.pending}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Filter by Subscription</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Subscriptions</option>
                <option value="subscribed">Subscribed</option>
                <option value="not-subscribed">Not Subscribed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Filter by Verification</label>
              <select
                value={filterVerification}
                onChange={(e) => setFilterVerification(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Verification Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Corporate Accounts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            {error ? (
              <div className="p-6 text-center text-red-600">
                <p className="font-medium">Error loading corporate accounts</p>
                <p className="text-sm">{error}</p>
              </div>
            ) : loading ? (
              <div className="p-6 text-center text-gray-500">
                <p>Loading corporate accounts...</p>
              </div>
            ) : corporates.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="font-medium">No corporate accounts registered yet</p>
                <p className="text-sm mt-1">Corporate accounts will appear here once they are created and registered in the system.</p>
              </div>
            ) : filteredCorporates.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No corporate accounts match your filters</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Company Name</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Subscription</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Verification</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 text-xs md:text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCorporates.map((corporate) => (
                    <tr key={corporate._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-xs md:text-sm text-gray-900 font-medium">{corporate.companyName}</td>
                      <td className="py-3 px-4 text-xs md:text-sm text-gray-600">{corporate.email || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(corporate.status)}`}>
                          {getStatusLabel(corporate.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getVerificationColor(corporate.verificationStatus)}`}>
                          {getVerificationLabel(corporate.verificationStatus)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs md:text-sm text-gray-600">
                        {new Date(corporate.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => setSelectedCorporate(corporate)}
                          className="text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination info */}
          {!loading && !error && (
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex justify-between items-center text-xs md:text-sm text-gray-600">
              <span>Showing {filteredCorporates.length} of {corporates.length} companies</span>
              <span>Page 1</span>
            </div>
          )}
        </div>

        {/* Corporate Details Modal */}
        {selectedCorporate && (
          <div 
            className="fixed inset-0 backdrop-blur-sm bg-transparent flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCorporate(null)}>
            <div 
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-linear-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-white">Corporate Details</h2>
                <button 
                  onClick={() => setSelectedCorporate(null)}
                  className="text-white hover:text-gray-200 text-2xl leading-none">
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {actionError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800 text-sm">
                    {actionError}
                  </div>
                )}

                {/* Company Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Company Name</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.companyName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Email</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Phone</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Registration Number</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.registrationNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Industry</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.industry || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Country</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.country || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">State</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.state || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Website</p>
                      <p className="text-sm md:text-base text-gray-900 mt-1">{selectedCorporate.website || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Status & Verification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Account Status</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Subscription Status</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCorporate.status)}`}>
                          {getStatusLabel(selectedCorporate.status)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium uppercase">Verification Status</p>
                      <div className="mt-2">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getVerificationColor(selectedCorporate.verificationStatus)}`}>
                          {getVerificationLabel(selectedCorporate.verificationStatus)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Admin Actions</h3>
                  
                  {/* Subscription Status Change */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Change Subscription Status</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {['subscribed', 'not-subscribed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(selectedCorporate._id, status)}
                          disabled={actionLoading || selectedCorporate.status === status}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedCorporate.status === status
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : status === 'subscribed'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}>
                          {actionLoading ? 'Processing...' : `Set ${getStatusLabel(status)}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Verification Status Change */}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Change Verification Status</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {['verified', 'pending', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleVerificationChange(selectedCorporate._id, status)}
                          disabled={actionLoading || selectedCorporate.verificationStatus === status}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedCorporate.verificationStatus === status
                              ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                              : status === 'verified'
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : status === 'pending'
                              ? 'bg-amber-600 text-white hover:bg-amber-700'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}>
                          {actionLoading ? 'Processing...' : `Set ${getVerificationLabel(status)}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
