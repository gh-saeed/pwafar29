import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const menuItems = await db.collection('navmobile')
      .find()
      .sort({ order: 1 })
      .toArray();
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error in GET /api/settings/navmobile:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت آیتم‌های منو' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const menuItem = await request.json();
    const client = await clientPromise;
    const db = client.db();

    // Validate required fields
    if (!menuItem.label || !menuItem.href || !menuItem.icon) {
      return NextResponse.json(
        { error: 'عنوان، لینک و آیکون اجباری هستند' },
        { status: 400 }
      );
    }

    // Get the current highest order
    const lastItem = await db.collection('navmobile')
      .find()
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const newOrder = lastItem.length > 0 ? lastItem[0].order + 1 : 0;

    const result = await db.collection('navmobile').insertOne({
      ...menuItem,
      order: newOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ _id: result.insertedId });
  } catch (error) {
    console.error('Error in POST /api/settings/navmobile:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد آیتم منو' },
      { status: 500 }
    );
  }
} 