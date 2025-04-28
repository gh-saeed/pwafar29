'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-[300px] border rounded-lg animate-pulse bg-gray-100" />
});

export default function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [pages, setPages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    tags: '',
    image: '',
    pageIds: []
  });

  useEffect(() => {
    fetchPosts();
    fetchPages();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('خطا در دریافت نوشته‌ها');
    }
  };

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
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const postData = {
        ...formData,
        tags,
        pageIds: formData.pageIds || []
      };

      const response = await fetch('/api/posts', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isEditing ? { id: editingId, ...postData } : postData),
      });

      if (response.ok) {
        toast.success(isEditing ? 'نوشته با موفقیت ویرایش شد' : 'نوشته با موفقیت ایجاد شد');
        setIsEditing(false);
        setEditingId(null);
        setFormData({
          title: '',
          slug: '',
          summary: '',
          content: '',
          tags: '',
          image: '',
          pageIds: []
        });
        fetchPosts();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'خطا در ذخیره نوشته');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(error.message);
    }
  };

  const handleEdit = (post) => {
    setIsEditing(true);
    setEditingId(post._id);
    setFormData({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      tags: post.tags.join(', '),
      image: post.image,
      pageIds: post.pageIds || []
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('آیا از حذف این نوشته اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('نوشته با موفقیت حذف شد');
        fetchPosts();
      } else {
        throw new Error('خطا در حذف نوشته');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
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

  const togglePageSelection = (pageId) => {
    setFormData(prev => ({
      ...prev,
      pageIds: prev.pageIds.includes(pageId)
        ? prev.pageIds.filter(id => id !== pageId)
        : [...prev.pageIds, pageId]
    }));
  };

  return (
    <div className="bg-gray-100 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت نوشته‌ها</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setEditingId(null);
            setFormData({
              title: '',
              slug: '',
              summary: '',
              content: '',
              tags: '',
              image: '',
              pageIds: []
            });
          }}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          نوشته جدید
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
              خلاصه
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-20"
            />
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
              برچسب‌ها
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="برچسب‌ها را با کاما جدا کنید"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              تصویر
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="آدرس تصویر"
              />
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="p-2 border rounded-lg hover:bg-gray-50"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              برگه‌ها
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {pages.map((page) => (
                <label
                  key={page._id}
                  className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.pageIds.includes(page._id)}
                    onChange={() => togglePageSelection(page._id)}
                    className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm">{page.title}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                  title: '',
                  slug: '',
                  summary: '',
                  content: '',
                  tags: '',
                  image: '',
                  pageIds: []
                });
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

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white rounded-xl shadow-sm p-4 text-right">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm font-medium text-gray-800">{post.title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(post.updatedAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  پیوند: /{post.slug}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  برچسب‌ها: {post.tags.join(', ')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  برگه‌ها: {post.pageIds?.map(pageId => 
                    pages.find(p => p._id === pageId)?.title
                  ).filter(Boolean).join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
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