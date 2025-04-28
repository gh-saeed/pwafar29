import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Menu from '@/models/Menu';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menus = await Menu.findAll(db);
    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error in GET /api/menus:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت منوها' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const menuData = await request.json();
    
    // اعتبارسنجی داده‌های ورودی
    if (!menuData.title || !menuData.url) {
      return NextResponse.json(
        { error: 'عنوان و آدرس منو اجباری هستند' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const menuId = await Menu.create(db, menuData);
    return NextResponse.json({ _id: menuId });
  } catch (error) {
    console.error('Error in POST /api/menus:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در ایجاد منو' },
      { status: 500 }
    );
  }
} 