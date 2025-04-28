import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const mobile = searchParams.get('mobile');
    
    let user;
    if (id) {
      user = await User.findById(db, id);
    } else if (mobile) {
      user = await User.findByMobile(db, mobile);
    } else {
      const users = await User.findAll(db);
      return NextResponse.json(users);
    }

    if (!user) {
      return NextResponse.json(
        { error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Remove password from response
    delete user.password;
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات کاربر' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    
    // Check required fields
    if (!data.name || !data.mobile) {
      return NextResponse.json(
        { error: 'نام و شماره موبایل الزامی هستند' },
        { status: 400 }
      );
    }

    // Validate mobile number format (simple validation)
    const mobileRegex = /^09[0-9]{9}$/;
    if (!mobileRegex.test(data.mobile)) {
      return NextResponse.json(
        { error: 'شماره موبایل نامعتبر است' },
        { status: 400 }
      );
    }

    try {
      const userId = await User.create(db, data);
      return NextResponse.json({ _id: userId });
    } catch (error) {
      // Handle duplicate mobile error
      if (error.message.includes('شماره موبایل قبلاً ثبت شده است')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت کاربر جدید' },
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
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    // Validate mobile number format if it's being updated
    if (updateData.mobile) {
      const mobileRegex = /^09[0-9]{9}$/;
      if (!mobileRegex.test(updateData.mobile)) {
        return NextResponse.json(
          { error: 'شماره موبایل نامعتبر است' },
          { status: 400 }
        );
      }
    }

    try {
      await User.update(db, _id, updateData);
      return NextResponse.json({ success: true });
    } catch (error) {
      // Handle duplicate mobile error
      if (error.message.includes('شماره موبایل قبلاً ثبت شده است')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in PUT /api/users:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اطلاعات کاربر' },
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
        { error: 'شناسه کاربر الزامی است' },
        { status: 400 }
      );
    }

    await User.delete(db, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/users:', error);
    return NextResponse.json(
      { error: 'خطا در حذف کاربر' },
      { status: 500 }
    );
  }
} 