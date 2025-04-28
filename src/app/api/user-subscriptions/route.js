import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import UserSubscription from '@/models/UserSubscription';

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let subscriptions;
    if (userId) {
      subscriptions = await UserSubscription.findByUserId(db, userId);
    } else {
      subscriptions = await UserSubscription.findAll(db);
    }
    
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error in GET /api/user-subscriptions:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست اشتراک‌ها' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    
    // بررسی وجود کاربر و سرویس
    if (!data.userId || !data.serviceId) {
      return NextResponse.json(
        { error: 'شناسه کاربر و سرویس الزامی است' },
        { status: 400 }
      );
    }

    // بررسی تاریخ شروع و پایان
    if (!data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'تاریخ شروع و پایان اشتراک الزامی است' },
        { status: 400 }
      );
    }

    const subscriptionId = await UserSubscription.create(db, data);
    return NextResponse.json({ _id: subscriptionId });
  } catch (error) {
    console.error('Error in POST /api/user-subscriptions:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت اشتراک' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (!_id) {
      return NextResponse.json(
        { error: 'شناسه اشتراک الزامی است' },
        { status: 400 }
      );
    }

    await UserSubscription.update(db, _id, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/user-subscriptions:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اشتراک' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'شناسه اشتراک الزامی است' },
        { status: 400 }
      );
    }

    await UserSubscription.delete(db, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/user-subscriptions:', error);
    return NextResponse.json(
      { error: 'خطا در حذف اشتراک' },
      { status: 500 }
    );
  }
} 