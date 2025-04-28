import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const notifications = await Notification.findAll(db);
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اعلان‌ها' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const notificationData = await request.json();
    
    if (!notificationData.title || !notificationData.message) {
      return NextResponse.json(
        { error: 'عنوان و متن اعلان اجباری هستند' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const notificationId = await Notification.create(db, notificationData);
    return NextResponse.json({ _id: notificationId });
  } catch (error) {
    console.error('Error in POST /api/notifications:', error);
    return NextResponse.json(
      { error: error.message || 'خطا در ایجاد اعلان' },
      { status: 500 }
    );
  }
} 