'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export default function HomeDesignManagement() {
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({ 
    title: '', 
    services: [] 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/homedesign');
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleAddSection = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/homedesign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSection),
      });
      if (response.ok) {
        setNewSection({ title: '', services: [] });
        fetchSections();
      }
    } catch (error) {
      console.error('Error adding section:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (id) => {
    if (window.confirm('آیا از حذف این بخش مطمئن هستید؟')) {
      try {
        const response = await fetch(`/api/homedesign/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchSections();
        }
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const handleAddService = (sectionId) => {
    setSections(sections.map(section => {
      if (section._id === sectionId) {
        return {
          ...section,
          services: [...section.services, { title: '', icon: '', href: '' }]
        };
      }
      return section;
    }));
  };

  const handleUpdateService = (sectionId, serviceIndex, field, value) => {
    setSections(sections.map(section => {
      if (section._id === sectionId) {
        const updatedServices = [...section.services];
        updatedServices[serviceIndex] = {
          ...updatedServices[serviceIndex],
          [field]: value
        };
        return {
          ...section,
          services: updatedServices
        };
      }
      return section;
    }));
  };

  const handleDeleteService = (sectionId, serviceIndex) => {
    setSections(sections.map(section => {
      if (section._id === sectionId) {
        return {
          ...section,
          services: section.services.filter((_, index) => index !== serviceIndex)
        };
      }
      return section;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت طراحی صفحه اصلی</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <form onSubmit={handleAddSection} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              عنوان بخش
            </label>
            <input
              type="text"
              id="title"
              value={newSection.title}
              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <Plus className="w-4 h-4 ml-2" />
            افزودن بخش جدید
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section._id} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">{section.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddService(section._id)}
                  className="text-teal-600 hover:text-teal-800"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {section.services.map((service, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleUpdateService(section._id, index, 'title', e.target.value)}
                      placeholder="عنوان سرویس"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={service.icon}
                      onChange={(e) => handleUpdateService(section._id, index, 'icon', e.target.value)}
                      placeholder="آیکون (کد HTML)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      value={service.href}
                      onChange={(e) => handleUpdateService(section._id, index, 'href', e.target.value)}
                      placeholder="لینک"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    />
                    <button
                      onClick={() => handleDeleteService(section._id, index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 