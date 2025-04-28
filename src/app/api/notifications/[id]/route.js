import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const notification = await Notification.findById(db, id);

    if (!notification) {
      return NextResponse.json(
        { error: 'اعلان یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error in GET /api/notifications/[id]:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اعلان' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const result = await Notification.update(db, id, updateData);

    if (!result) {
      return NextResponse.json(
        { error: 'اعلان یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'اعلان با موفقیت بروزرسانی شد' });
  } catch (error) {
    console.error('Error in PUT /api/notifications/[id]:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اعلان' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const result = await Notification.delete(db, id);

    if (!result) {
      return NextResponse.json(
        { error: 'اعلان یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'اعلان با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error in DELETE /api/notifications/[id]:', error);
    return NextResponse.json(
      { error: 'خطا در حذف اعلان' },
      { status: 500 }
    );
  }
} 