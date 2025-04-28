'use client';

import React, { useState, useEffect } from 'react';
import { Upload, Save, X, Trash2 } from 'lucide-react';

export default function LogoSettings() {
  const [logoData, setLogoData] = useState({
    text: '',
    imageUrl: '',
    useImage: false,
    useText: true,
  });
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLogoSettings();
  }, []);

  const fetchLogoSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/logo');
      if (response.ok) {
        const data = await response.json();
        setLogoData(data);
        if (data.imageUrl) {
          setPreviewImage(data.imageUrl);
        }
      } else {
        // If no settings exist yet, use defaults
        setLogoData({
          text: 'لوگو',
          imageUrl: '',
          useImage: false,
          useText: true,
        });
      }
    } catch (error) {
      console.error('Error fetching logo settings:', error);
      setMessage({ type: 'error', text: 'خطا در دریافت تنظیمات لوگو' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLogoData({
      ...logoData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload the image
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setLogoData({
          ...logoData,
          imageUrl: data.url,
        });
        setMessage({ type: 'success', text: 'تصویر با موفقیت آپلود شد' });
      } else {
        setMessage({ type: 'error', text: 'خطا در آپلود تصویر' });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'خطا در آپلود تصویر' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setLogoData({
      ...logoData,
      imageUrl: '',
    });
    setPreviewImage('');
    setMessage({ type: 'success', text: 'تصویر با موفقیت حذف شد' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings/logo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'تنظیمات لوگو با موفقیت ذخیره شد' });
      } else {
        setMessage({ type: 'error', text: 'خطا در ذخیره تنظیمات لوگو' });
      }
    } catch (error) {
      console.error('Error saving logo settings:', error);
      setMessage({ type: 'error', text: 'خطا در ذخیره تنظیمات لوگو' });
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">تنظیمات لوگو</h1>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          <div className="flex justify-between items-center">
            <p>{message.text}</p>
            <button onClick={clearMessage}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse">
              <input
                type="checkbox"
                id="useText"
                name="useText"
                checked={logoData.useText}
                onChange={handleInputChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="useText" className="text-gray-700">
                استفاده از متن
              </label>
            </div>

            {logoData.useText && (
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  متن لوگو
                </label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  value={logoData.text}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  placeholder="مثال: لوگو"
                />
              </div>
            )}

            <div className="flex items-center space-x-4 space-x-reverse">
              <input
                type="checkbox"
                id="useImage"
                name="useImage"
                checked={logoData.useImage}
                onChange={handleInputChange}
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
              />
              <label htmlFor="useImage" className="text-gray-700">
                استفاده از تصویر
              </label>
            </div>

            {logoData.useImage && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تصویر لوگو
                </label>
                <div className="mt-1 flex items-center space-x-4 space-x-reverse">
                  <div className="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      آپلود تصویر
                    </label>
                    <input
                      id="image-upload"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageUpload}
                    />
                    {previewImage && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="inline-flex items-center justify-center py-2 px-3 border border-red-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="ml-1 h-4 w-4" />
                        حذف تصویر
                      </button>
                    )}
                    <p className="text-xs text-gray-500">
                      PNG, JPG یا GIF (حداکثر 2MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span>در حال ذخیره...</span>
              ) : (
                <>
                  <Save className="ml-2 h-4 w-4" />
                  ذخیره تنظیمات
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">پیش‌نمایش لوگو</h2>
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center">
            {logoData.useImage && previewImage ? (
              <div className="w-10 h-10 ml-2">
                <img
                  src={previewImage}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : logoData.useImage ? (
              <div className="w-10 h-10 ml-2">
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ) : null}
            {logoData.useText && (
              <span className="text-2xl font-bold text-gray-800">{logoData.text}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 