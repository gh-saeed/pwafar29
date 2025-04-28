'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  Package,
  MessageSquare,
  Bell,
  Image,
  FileText,
  BookOpen,
} from 'lucide-react';

const menuItems = [
  {
    title: 'داشبورد',
    href: '/admin',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'کاربران',
    href: '/admin/users',
    icon: <Users className="w-5 h-5" />,
  },
  {
    title: 'سرویس‌ها',
    href: '/admin/services',
    icon: <Package className="w-5 h-5" />,
  },
  {
    title: 'پیام‌ها',
    href: '/admin/messages',
    icon: <MessageSquare className="w-5 h-5" />,
  },
  {
    title: 'اعلانات',
    href: '/admin/notifications',
    icon: <Bell className="w-5 h-5" />,
  },
  {
    title: 'گالری و رسانه',
    href: '/admin/media',
    icon: <Image className="w-5 h-5" />,
  },
  {
    title: 'برگه‌ها',
    href: '/admin/pages',
    icon: <FileText className="w-5 h-5" />,
  },
  {
    title: 'نوشته‌ها',
    href: '/admin/posts',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: 'طراحی صفحه اصلی',
    href: '/admin/homedesign',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'تنظیمات',
    href: '/admin/settings',
    icon: <Settings className="w-5 h-5" />,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-teal-600">پنل مدیریت فر</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar; 