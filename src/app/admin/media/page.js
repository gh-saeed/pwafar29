'use client';

import { useState, useEffect, useRef } from 'react';
import { Image, Upload, Trash2, Copy, X, Edit2, Video } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MediaGallery() {
  const [files, setFiles] = useState([]);
  const [media, setMedia] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [format, setFormat] = useState('webp');
  const [quality, setQuality] = useState(80);
  const [editingId, setEditingId] = useState(null);
  const [editingFilename, setEditingFilename] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [mediaType, setMediaType] = useState('image');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch('/api/media');
      const data = await response.json();
      setMedia(data);
    } catch (error) {
      console.error('Error fetching media:', error);
      toast.error('خطا در دریافت فایل‌ها');
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('لطفا حداقل یک فایل انتخاب کنید');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('format', format);
        formData.append('quality', quality);
        formData.append('type', mediaType);

        const response = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      toast.success('آپلود با موفقیت انجام شد');
      setFiles([]);
      fetchMedia();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('خطا در آپلود فایل‌ها');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id, filename) => {
    if (!confirm('آیا از حذف این فایل اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/media?id=${id}&filename=${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('فایل با موفقیت حذف شد');
        fetchMedia();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('خطا در حذف فایل');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error('لطفا حداقل یک فایل را انتخاب کنید');
      return;
    }

    if (!confirm(`آیا از حذف ${selectedItems.length} فایل اطمینان دارید؟`)) return;

    try {
      const response = await fetch(`/api/media?ids=${JSON.stringify(selectedItems)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('فایل‌ها با موفقیت حذف شدند');
        setSelectedItems([]);
        fetchMedia();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Error deleting files:', error);
      toast.error('خطا در حذف فایل‌ها');
    }
  };

  const handleEditStart = (id, filename) => {
    setEditingId(id);
    setEditingFilename(filename);
  };

  const handleEditSave = async (id) => {
    try {
      const response = await fetch('/api/media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, filename: editingFilename }),
      });

      if (response.ok) {
        toast.success('نام فایل با موفقیت ویرایش شد');
        setEditingId(null);
        fetchMedia();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Error updating filename:', error);
      toast.error('خطا در ویرایش نام فایل');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('لینک کپی شد');
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">گالری و رسانه</h1>
        {selectedItems.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            حذف {selectedItems.length} فایل
          </button>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="image">تصویر</option>
              <option value="video">ویدیو</option>
            </select>
            {mediaType === 'image' && (
              <>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="border rounded-lg px-3 py-2"
                >
                  <option value="webp">WebP</option>
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                </select>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-gray-600">کیفیت: {quality}%</span>
              </>
            )}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              accept={mediaType === 'image' ? 'image/*' : 'video/*'}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex flex-col items-center justify-center gap-2 text-gray-600"
            >
              {mediaType === 'image' ? (
                <Image className="w-8 h-8" />
              ) : (
                <Video className="w-8 h-8" />
              )}
              <span>برای آپلود فایل‌ها اینجا کلیک کنید</span>
            </button>
          </div>

          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                >
                  <span className="text-sm">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
            className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50"
          >
            {isUploading ? 'در حال آپلود...' : 'آپلود فایل‌ها'}
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {media.map((item) => (
          <div
            key={item._id}
            className={`bg-white rounded-lg shadow-sm overflow-hidden relative ${
              selectedItems.includes(item._id) ? 'ring-2 ring-teal-500' : ''
            }`}
          >
            <div className="relative aspect-square">
              {item.type === 'image' ? (
                <img
                  src={item.path}
                  alt={item.filename}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={item.path}
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                <button
                  onClick={() => copyToClipboard(item.path)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="کپی لینک"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditStart(item._id, item.filename)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="ویرایش نام"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id, item.filename)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100"
                  title="حذف"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              <button
                onClick={() => toggleSelectItem(item._id)}
                className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
                  selectedItems.includes(item._id)
                    ? 'bg-teal-500 border-teal-500'
                    : 'bg-white border-gray-300'
                }`}
                title={selectedItems.includes(item._id) ? 'عدم انتخاب' : 'انتخاب'}
              />
            </div>
            <div className="p-2">
              {editingId === item._id ? (
                <input
                  type="text"
                  value={editingFilename}
                  onChange={(e) => setEditingFilename(e.target.value)}
                  onBlur={() => handleEditSave(item._id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSave(item._id);
                    } else if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  className="w-full text-sm border rounded px-2 py-1"
                  autoFocus
                />
              ) : (
                <p className="text-sm text-gray-600 truncate">{item.filename}</p>
              )}
              <p className="text-xs text-gray-400">
                {item.type === 'image' ? item.format.toUpperCase() : 'MP4'} - {(item.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 