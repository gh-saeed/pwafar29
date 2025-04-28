'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    linkUrl: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (!response.ok) throw new Error('خطا در دریافت اطلاعات بنرها');
      const data = await response.json();
      setBanners(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBanner ? '/api/banners' : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      const data = editingBanner ? { ...formData, _id: editingBanner._id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('خطا در ذخیره اطلاعات بنر');
      
      await fetchBanners();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      linkUrl: banner.linkUrl || '',
      order: banner.order || 0,
      isActive: banner.isActive ?? true
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این بنر اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/banners?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('خطا در حذف بنر');
      
      await fetchBanners();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      order: 0,
      isActive: true
    });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">در حال بارگذاری...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">مدیریت بنرها</h1>

      {/* Banner Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingBanner ? 'ویرایش بنر' : 'افزودن بنر جدید'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">آدرس تصویر</label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">لینک</label>
            <input
              type="text"
              value={formData.linkUrl}
              onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">ترتیب نمایش</label>
            <input
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">توضیحات</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="ml-2"
              />
              <span className="text-sm font-medium">فعال</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingBanner ? 'بروزرسانی' : 'افزودن'}
          </button>
          {editingBanner && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              انصراف
            </button>
          )}
        </div>
      </form>

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-48">
              {banner.imageUrl ? (
                <Image
                  src={banner.imageUrl}
                  alt={banner.title || 'بنر'}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-2">{banner.title || 'بدون عنوان'}</h3>
              {banner.description && (
                <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  ترتیب: {banner.order}
                </span>
                <span className={`text-sm ${banner.isActive ? 'text-green-500' : 'text-red-500'}`}>
                  {banner.isActive ? 'فعال' : 'غیرفعال'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => handleEdit(banner)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 