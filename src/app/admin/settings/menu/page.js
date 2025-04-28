  'use client';

  import React, { useState, useEffect } from 'react';
  import { Plus, Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

  export default function MenuManagement() {
    const [menus, setMenus] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [formData, setFormData] = useState({
      title: '',
      url: '',
      icon: '',
      order: 0,
      isActive: true,
    });

    useEffect(() => {
      fetchMenus();
    }, []);

    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const url = editingMenu
          ? `/api/menus/${editingMenu._id}`
          : '/api/menus';
        const method = editingMenu ? 'PUT' : 'POST';

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setIsModalOpen(false);
          setEditingMenu(null);
          setFormData({
            title: '',
            url: '',
            icon: '',
            order: 0,
            isActive: true,
          });
          fetchMenus();
        }
      } catch (error) {
        console.error('Error saving menu:', error);
      }
    };

    const handleEdit = (menu) => {
      setEditingMenu(menu);
      setFormData({
        title: menu.title,
        url: menu.url,
        icon: menu.icon,
        order: menu.order,
        isActive: menu.isActive,
      });
      setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
      if (window.confirm('آیا از حذف این آیتم منو اطمینان دارید؟')) {
        try {
          const response = await fetch(`/api/menus/${id}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            fetchMenus();
          }
        } catch (error) {
          console.error('Error deleting menu:', error);
        }
      }
    };

    const handleOrderChange = async (id, direction) => {
      const menu = menus.find((m) => m._id === id);
      const currentIndex = menus.findIndex((m) => m._id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

      if (newIndex >= 0 && newIndex < menus.length) {
        const newOrder = menus[newIndex].order;
        menus[newIndex].order = menu.order;
        menu.order = newOrder;

        try {
          await fetch(`/api/menus/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: menu.order }),
          });

          await fetch(`/api/menus/${menus[newIndex]._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order: menus[newIndex].order }),
          });

          fetchMenus();
        } catch (error) {
          console.error('Error updating menu order:', error);
        }
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">مدیریت منو</h1>
          <button
            onClick={() => {
              setEditingMenu(null);
              setFormData({
                title: '',
                url: '',
                icon: '',
                order: 0,
                isActive: true,
              });
              setIsModalOpen(true);
            }}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            افزودن آیتم منو
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عنوان
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آدرس
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  آیکون
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  وضعیت
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ترتیب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(menus) && menus.map((menu) => (
                <tr key={menu._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {menu.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {menu.url}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {menu.icon}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        menu.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {menu.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOrderChange(menu._id, 'up')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOrderChange(menu._id, 'down')}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(menu._id)}
                        className="text-red-600 hover:text-red-900"
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingMenu ? 'ویرایش آیتم منو' : 'افزودن آیتم منو'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    عنوان
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    آدرس
                  </label>
                  <input
                    type="text"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    آیکون
                  </label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) =>
                      setFormData({ ...formData, icon: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                    placeholder="نام آیکون از Lucide Icons"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ترتیب
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 block text-sm text-gray-900">
                    فعال
                  </label>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                  >
                    {editingMenu ? 'ذخیره تغییرات' : 'افزودن'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  } 






//   'use client';

// import { useState, useEffect } from 'react';
// import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

// export default function MenuSettingsPage() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [newItem, setNewItem] = useState({
//     label: '',
//     href: '',
//     icon: '',
//     position: 'bottom'
//   });

//   useEffect(() => {
//     fetchMenuItems();
//   }, []);

//   const fetchMenuItems = async () => {
//     try {
//       const response = await fetch('/api/settings/menu');
//       const data = await response.json();
//       setMenuItems(data);
//     } catch (error) {
//       console.error('Error fetching menu items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/settings/menu', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newItem),
//       });

//       if (response.ok) {
//         setNewItem({
//           label: '',
//           href: '',
//           icon: '',
//           position: 'bottom'
//         });
//         fetchMenuItems();
//       }
//     } catch (error) {
//       console.error('Error adding menu item:', error);
//     }
//   };

//   const handleDeleteItem = async (id) => {
//     try {
//       await fetch(`/api/settings/menu/${id}`, {
//         method: 'DELETE',
//       });
//       fetchMenuItems();
//     } catch (error) {
//       console.error('Error deleting menu item:', error);
//     }
//   };

//   const handleMoveItem = async (id, direction) => {
//     try {
//       await fetch(`/api/settings/menu/${id}/move`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ direction }),
//       });
//       fetchMenuItems();
//     } catch (error) {
//       console.error('Error moving menu item:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="max-w-2xl mx-auto">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6">تنظیمات منو</h1>

//         {/* Add New Item Form */}
//         <form onSubmit={handleAddItem} className="bg-white p-6 rounded-lg shadow mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">افزودن آیتم جدید</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 عنوان
//               </label>
//               <input
//                 type="text"
//                 value={newItem.label}
//                 onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 لینک
//               </label>
//               <input
//                 type="text"
//                 value={newItem.href}
//                 onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 آیکون
//               </label>
//               <input
//                 type="text"
//                 value={newItem.icon}
//                 onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//                 placeholder="نام آیکون از Lucide Icons"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 موقعیت
//               </label>
//               <select
//                 value={newItem.position}
//                 onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
//               >
//                 <option value="bottom">منوی پایین</option>
//                 <option value="star">منوی ستاره</option>
//               </select>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
//           >
//             افزودن آیتم
//           </button>
//         </form>

//         {/* Menu Items List */}
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <div className="p-4 border-b">
//             <h2 className="text-lg font-semibold text-gray-800">لیست آیتم‌های منو</h2>
//           </div>
//           <div className="divide-y divide-gray-200">
//             {menuItems.map((item, index) => (
//               <div
//                 key={item._id}
//                 className="p-4 flex items-center justify-between"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="flex flex-col gap-1">
//                     <button
//                       onClick={() => handleMoveItem(item._id, 'up')}
//                       disabled={index === 0}
//                       className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
//                     >
//                       <ArrowUp className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleMoveItem(item._id, 'down')}
//                       disabled={index === menuItems.length - 1}
//                       className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
//                     >
//                       <ArrowDown className="w-4 h-4" />
//                     </button>
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-800">{item.label}</div>
//                     <div className="text-sm text-gray-500">{item.href}</div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleDeleteItem(item._id)}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 