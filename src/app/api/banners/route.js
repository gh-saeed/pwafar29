import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    let banners;
    if (id) {
      const banner = await Banner.findById(db, id);
      if (!banner) {
        return NextResponse.json(
          { error: 'بنر یافت نشد' },
          { status: 404 }
        );
      }
      return NextResponse.json(banner);
    } else if (activeOnly) {
      banners = await Banner.findActive(db);
    } else {
      banners = await Banner.findAll(db);
    }

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error in GET /api/banners:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات بنرها' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    
    // Check required fields
    if (!data.imageUrl) {
      return NextResponse.json(
        { error: 'آدرس تصویر بنر الزامی است' },
        { status: 400 }
      );
    }

    const bannerId = await Banner.create(db, data);
    return NextResponse.json({ _id: bannerId });
  } catch (error) {
    console.error('Error in POST /api/banners:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت بنر جدید' },
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
        { error: 'شناسه بنر الزامی است' },
        { status: 400 }
      );
    }

    await Banner.update(db, _id, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/banners:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی اطلاعات بنر' },
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
        { error: 'شناسه بنر الزامی است' },
        { status: 400 }
      );
    }

    await Banner.delete(db, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/banners:', error);
    return NextResponse.json(
      { error: 'خطا در حذف بنر' },
      { status: 500 }
    );
  }
} 