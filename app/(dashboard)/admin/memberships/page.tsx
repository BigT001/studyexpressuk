'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MembershipPlan {
  _id: string;
  name: string;
  type: 'individual' | 'corporate';
  price: number;
  currency: string;
  billingInterval: 'one-time' | 'month' | 'year';
  description: string;
  features: string[];
  subscribers?: number;
  active: boolean;
  courseDiscount?: number;
  eventDiscount?: number;
  createdAt: string;
}

export default function MembershipsManagementPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'individual' as 'individual' | 'corporate',
    price: '' as string | number,
    billingInterval: 'one-time' as 'one-time' | 'month' | 'year',
    description: '',
    courseDiscount: '' as string | number,
    eventDiscount: '' as string | number,
    features: '',
  });

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/admin/plans');
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (error) {
      console.error('Failed to fetch plans', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = () => {
    setSelectedPlan(null);
    setFormData({
      name: '',
      type: 'individual',
      price: '',
      billingInterval: 'one-time',
      description: '',
      courseDiscount: '',
      eventDiscount: '',
      features: ''
    });
    setShowModal(true);
  };

  const handleEditPlan = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      billingInterval: plan.billingInterval,
      description: plan.description,
      courseDiscount: plan.courseDiscount || 0,
      eventDiscount: plan.eventDiscount || 0,
      features: plan.features.join('\n'),
    });
    setShowModal(true);
  };

  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        const res = await fetch(`/api/admin/plans/${planId}`, { method: 'DELETE' });
        if (res.ok) {
          fetchPlans();
        } else {
          alert('Failed to delete plan');
        }
      } catch (error) {
        console.error('Error deleting plan', error);
      }
    }
  };

  const handleSavePlan = async () => {
    if (!formData.name || formData.price === '') {
      alert('Please fill in all required fields');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      courseDiscount: Number(formData.courseDiscount) || 0,
      eventDiscount: Number(formData.eventDiscount) || 0,
      features: formData.features.split('\n').filter(f => f.trim()),
    };

    try {
      if (selectedPlan) {
        const res = await fetch(`/api/admin/plans/${selectedPlan._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to update plan');
        }
      } else {
        const res = await fetch('/api/admin/plans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to create plan');
        }
      }
      setShowModal(false);
      fetchPlans();
    } catch (error: any) {
      console.error('Error saving plan', error);
      alert(error.message || 'Failed to save plan');
    }
  };

  const totalRevenue = 0; // consistent with backend mock for now, implement real count later if needed
  const activeMemberships = 0; // consistent with backend mock for now

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Membership Management</h2>
          <p className="text-gray-600 mt-2">Manage subscription plans, renewals, and member benefits</p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="bg-[#008200] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#006600] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Create Plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-600">
          <p className="text-sm text-gray-600">Active Memberships</p>
          <p className="text-3xl font-bold text-green-600">{activeMemberships}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-l-4 border-blue-600">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-l-4 border-orange-600">
          <p className="text-sm text-gray-600">Active Plans</p>
          <p className="text-3xl font-bold text-orange-600">{plans.filter(p => p.active).length}</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
          <h3 className="text-lg font-bold mb-4">💳 Membership Plans</h3>
          <p className="text-gray-600 text-sm mb-4">Create and manage subscription tiers</p>
          <button
            onClick={handleCreatePlan}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Manage Plans
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
          <h3 className="text-lg font-bold mb-4">📊 Active Memberships</h3>
          <p className="text-gray-600 text-sm mb-4">View and manage active memberships</p>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            View Members
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-600">
          <h3 className="text-lg font-bold mb-4">💰 Stripe Integration</h3>
          <p className="text-gray-600 text-sm mb-4">Process payments securely</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            Configure Stripe
          </button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">📋 Membership Plans</h3>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-500" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No membership plans created yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Plan Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Discounts</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${plan.type === 'individual'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                        }`}>
                        {plan.type === 'individual' ? '👤 Individual' : '🏢 Corporate'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      ${plan.price}
                      <span className="text-xs text-gray-500 block">/{plan.billingInterval}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {(plan.courseDiscount || 0) > 0 && <div className="text-green-600">Course: -{plan.courseDiscount}%</div>}
                      {(plan.eventDiscount || 0) > 0 && <div className="text-blue-600">Event: -{plan.eventDiscount}%</div>}
                      {!(plan.courseDiscount || 0) && !(plan.eventDiscount || 0) && <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${plan.active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                        }`}>
                        {plan.active ? '✓ Active' : '⊘ Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPlan(plan)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">
              {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Individual Plan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'corporate' })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="individual">Individual</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interval</label>
                  <select
                    value={formData.billingInterval}
                    onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value as 'one-time' | 'month' | 'year' })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="one-time">One-time</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.courseDiscount}
                    onChange={(e) => setFormData({ ...formData, courseDiscount: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Discount %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.eventDiscount}
                    onChange={(e) => setFormData({ ...formData, eventDiscount: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Brief description of the plan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (one per line)</label>
                <textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                  placeholder="Access to all courses&#10;Certificate of completion&#10;24/7 support"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlan}
                  className="flex-1 px-4 py-2 bg-[#008200] text-white rounded-lg hover:bg-[#006600]"
                >
                  {selectedPlan ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
