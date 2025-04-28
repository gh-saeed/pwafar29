'use client';

import React from 'react';
import {
  Users,
  Package,
  MessageSquare,
  Bell,
  TrendingUp,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  {
    title: 'کاربران فعال',
    value: '1,234',
    icon: <Users className="w-6 h-6" />,
    change: '+12%',
    changeType: 'positive',
  },
  {
    title: 'سرویس‌های فعال',
    value: '45',
    icon: <Package className="w-6 h-6" />,
    change: '+5%',
    changeType: 'positive',
  },
  {
    title: 'پیام‌های جدید',
    value: '89',
    icon: <MessageSquare className="w-6 h-6" />,
    change: '-3%',
    changeType: 'negative',
  },
  {
    title: 'اعلانات',
    value: '12',
    icon: <Bell className="w-6 h-6" />,
    change: '+2%',
    changeType: 'positive',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">آخرین بروزرسانی: ۱ ساعت پیش</span>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            بروزرسانی
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 bg-teal-50 rounded-lg">{stat.icon}</div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm ${
                  stat.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 mr-1">از ماه گذشته</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">آمار کاربران</h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-12 h-12 text-gray-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">آخرین فعالیت‌ها</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="font-medium">کاربر جدید</p>
                    <p className="text-sm text-gray-500">ثبت‌نام در سامانه</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">۲ دقیقه پیش</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">تنظیمات سریع</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/settings/logo" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center ml-3">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium">تنظیمات لوگو</p>
              <p className="text-sm text-gray-500">مدیریت لوگو و متن سایت</p>
            </div>
          </Link>
          <Link href="/admin/settings/menu" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center ml-3">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium">تنظیمات منو</p>
              <p className="text-sm text-gray-500">مدیریت منوی سایت</p>
            </div>
          </Link>
          <Link href="/admin/settings/navmobile" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center ml-3">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium">تنظیمات منو موبایل</p>
              <p className="text-sm text-gray-500">مدیریت منوی سایت</p>
            </div>
          </Link>
          <Link href="/admin/rss" className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center ml-3">
              <Settings className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-medium">مدیریت RSS</p>
              <p className="text-sm text-gray-500">مدیریت فیدهای RSS</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
} 