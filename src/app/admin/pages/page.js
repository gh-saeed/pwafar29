'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Page from '@/models/Page';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-[300px] border rounded-lg animate-pulse bg-gray-100" />
});

export default function PagesManagement() {
  const [pages, setPages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    customStyle: '',
    displayStyle: 'default'
  });

  const displayStyles = Page.getDisplayStyles();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('خطا در دریافت برگه‌ها');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/pages', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditing ? { id: editingId, ...formData } : formData),
      });

      if (response.ok) {
        toast.success(isEditing ? 'برگه با موفقیت ویرایش شد' : 'برگه با موفقیت ایجاد شد');
        setIsEditing(false);
        setEditingId(null);
        setFormData({ title: '', slug: '', content: '', customStyle: '', displayStyle: 'default' });
        fetchPages();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'خطا در ذخیره برگه');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error(error.message);
    }
  };

  const handleEdit = (page) => {
    setIsEditing(true);
    setEditingId(page._id);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      customStyle: page.customStyle || '',
      displayStyle: page.displayStyle || 'default'
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این برگه اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/pages?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('برگه با موفقیت حذف شد');
        fetchPages();
      } else {
        throw new Error('خطا در حذف برگه');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-100 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت برگه‌ها</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);
            setFormData({ title: '', slug: '', content: '', customStyle: '', displayStyle: 'default' });
          }}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          برگه جدید
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                عنوان
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                پیوند (اختیاری)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="به صورت خودکار از عنوان ساخته می‌شود"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              محتوا
            </label>
            <Editor
              apiKey="di66v0xwm6ttndd103ax714vklfxbitqy4wbvjixyibgwrki"
              value={formData.content}
              onEditorChange={(content) => setFormData({ ...formData, content })}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
                directionality: 'rtl',
                language: 'fa_IR',
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استایل نمایش
            </label>
            <select
              value={formData.displayStyle}
              onChange={(e) => setFormData({ ...formData, displayStyle: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            >
              {displayStyles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استایل سفارشی (اختیاری)
            </label>
            <textarea
              value={formData.customStyle}
              onChange={(e) => setFormData({ ...formData, customStyle: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-20 font-mono text-sm"
              placeholder="CSS styles..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setFormData({ title: '', slug: '', content: '', customStyle: '', displayStyle: 'default' });
              }}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'ویرایش' : 'ذخیره'}
            </button>
          </div>
        </form>
      </div>

      {/* Pages List */}
      <div className="space-y-4">
        {pages.map((page) => (
          <div key={page._id} className="bg-white rounded-xl shadow-sm p-4 text-right">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-800">{page.title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(page.updatedAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  پیوند: /{page.slug}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  استایل: {displayStyles.find(s => s.id === page.displayStyle)?.name || 'پیش‌فرض'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(page)}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(page._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 