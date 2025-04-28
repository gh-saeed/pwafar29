'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, CreditCard } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    mobile: '',
    role: 'user',
    isActive: true
  });
  const [subscriptionForm, setSubscriptionForm] = useState({
    userId: '',
    serviceId: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, subscriptionsRes, servicesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/user-subscriptions'),
        fetch('/api/services')
      ]);

      if (!usersRes.ok || !subscriptionsRes.ok || !servicesRes.ok) {
        throw new Error('خطا در دریافت اطلاعات');
      }

      const [usersData, subscriptionsData, servicesData] = await Promise.all([
        usersRes.json(),
        subscriptionsRes.json(),
        servicesRes.json()
      ]);

      setUsers(usersData);
      setSubscriptions(subscriptionsData);
      setServices(servicesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/users?id=${editingId}` : '/api/users';
      const method = editingId ? 'PUT' : 'POST';
      
      const requestBody = editingId 
        ? { ...userForm, _id: editingId } 
        : userForm;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('خطا در ذخیره اطلاعات');
      }

      await fetchData();
      setShowUserForm(false);
      setUserForm({ name: '', mobile: '', role: 'user', isActive: true });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubscriptionSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/user-subscriptions?id=${editingId}` : '/api/user-subscriptions';
      const method = editingId ? 'PUT' : 'POST';
      
      const requestBody = editingId 
        ? { ...subscriptionForm, _id: editingId } 
        : subscriptionForm;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('خطا در ذخیره اطلاعات');
      }

      await fetchData();
      setShowSubscriptionForm(false);
      setSubscriptionForm({
        userId: '',
        serviceId: '',
        startDate: '',
        endDate: '',
        status: 'active'
      });
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (item, type) => {
    if (type === 'user') {
      setUserForm({
        name: item.name,
        mobile: item.mobile,
        role: item.role,
        isActive: item.isActive !== undefined ? item.isActive : true
      });
      setEditingId(item._id);
      setShowUserForm(true);
    } else {
      setSubscriptionForm({
        userId: item.userId,
        serviceId: item.serviceId,
        startDate: item.startDate.split('T')[0],
        endDate: item.endDate.split('T')[0],
        status: item.status
      });
      setEditingId(item._id);
      setShowSubscriptionForm(true);
    }
  };

  const handleDelete = async (id, type) => {
    if (!confirm('آیا از حذف این مورد اطمینان دارید؟')) return;

    try {
      const endpoint = type === 'user' ? 'users' : 'user-subscriptions';
      const response = await fetch(`/api/${endpoint}?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('خطا در حذف اطلاعات');
      }

      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.mobile.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.isActive === (statusFilter === 'active');
    return matchesSearch && matchesStatus;
  });

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.serviceId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex h-screen">
        <div className="flex-1 p-8">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">مدیریت کاربران و اشتراک‌ها</h1>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'users'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <Users className="w-5 h-5 inline-block ml-2" />
                کاربران
              </button>
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === 'subscriptions'
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <CreditCard className="w-5 h-5 inline-block ml-2" />
                اشتراک‌ها
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex space-x-4 rtl:space-x-reverse">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="جستجو..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="active">فعال</option>
                  <option value="inactive">غیرفعال</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (activeTab === 'users') {
                    setShowUserForm(true);
                    setUserForm({ name: '', mobile: '', role: 'user', isActive: true });
                    setEditingId(null);
                  } else {
                    setShowSubscriptionForm(true);
                    setSubscriptionForm({
                      userId: '',
                      serviceId: '',
                      startDate: '',
                      endDate: '',
                      status: 'active'
                    });
                    setEditingId(null);
                  }
                }}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                <Plus className="w-5 h-5 inline-block ml-2" />
                {activeTab === 'users' ? 'افزودن کاربر' : 'افزودن اشتراک'}
              </button>
            </div>

            {activeTab === 'users' ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نام
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        موبایل
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        نقش
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.mobile}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? 'مدیر' : 'کاربر'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'فعال' : 'غیرفعال'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user, 'user')}
                            className="text-teal-600 hover:text-teal-900 ml-4"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user._id, 'user')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        کاربر
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        سرویس
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاریخ شروع
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        تاریخ پایان
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        وضعیت
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {users.find(u => u._id === subscription.userId)?.name || subscription.userId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {services.find(s => s._id === subscription.serviceId)?.name || subscription.serviceId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(subscription.startDate).toLocaleDateString('fa-IR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(subscription.endDate).toLocaleDateString('fa-IR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {subscription.status === 'active' ? 'فعال' : 'غیرفعال'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(subscription, 'subscription')}
                            className="text-teal-600 hover:text-teal-900 ml-4"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(subscription._id, 'subscription')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'ویرایش کاربر' : 'افزودن کاربر جدید'}
            </h2>
            <form onSubmit={handleUserSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام
                  </label>
                  <input
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    موبایل
                  </label>
                  <input
                    type="tel"
                    value={userForm.mobile}
                    onChange={(e) => setUserForm({ ...userForm, mobile: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نقش
                  </label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="user">کاربر</option>
                    <option value="admin">مدیر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضعیت
                  </label>
                  <select
                    value={userForm.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setUserForm({ ...userForm, isActive: e.target.value === 'active' })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowUserForm(false);
                    setUserForm({ name: '', mobile: '', role: 'user', isActive: true });
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  {editingId ? 'بروزرسانی' : 'ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subscription Form Modal */}
      {showSubscriptionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'ویرایش اشتراک' : 'افزودن اشتراک جدید'}
            </h2>
            <form onSubmit={handleSubscriptionSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    کاربر
                  </label>
                  <select
                    value={subscriptionForm.userId}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, userId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">انتخاب کاربر</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سرویس
                  </label>
                  <select
                    value={subscriptionForm.serviceId}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, serviceId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">انتخاب سرویس</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ شروع
                  </label>
                  <input
                    type="date"
                    value={subscriptionForm.startDate}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, startDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    تاریخ پایان
                  </label>
                  <input
                    type="date"
                    value={subscriptionForm.endDate}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, endDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضعیت
                  </label>
                  <select
                    value={subscriptionForm.status}
                    onChange={(e) => setSubscriptionForm({ ...subscriptionForm, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="active">فعال</option>
                    <option value="inactive">غیرفعال</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubscriptionForm(false);
                    setSubscriptionForm({
                      userId: '',
                      serviceId: '',
                      startDate: '',
                      endDate: '',
                      status: 'active'
                    });
                    setEditingId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                >
                  {editingId ? 'بروزرسانی' : 'ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 