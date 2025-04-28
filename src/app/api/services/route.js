import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET(request) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let services;
    if (category) {
      services = await Service.findByCategory(db, category);
    } else {
      services = await Service.findAll(db);
    }
      
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error in GET /api/services:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست خدمات' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const db = await getDb();
    const data = await request.json();
    
    // Check required fields
    if (!data.name || !data.description || !data.price) {
      return NextResponse.json(
        { error: 'نام، توضیحات و قیمت خدمت الزامی هستند' },
        { status: 400 }
      );
    }

    // Convert duration to number if it exists
    if (data.duration) {
      data.duration = Number(data.duration);
    }

    const serviceId = await Service.create(db, data);
    return NextResponse.json({ _id: serviceId });
  } catch (error) {
    console.error('Error in POST /api/services:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت خدمت جدید' },
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
        { error: 'شناسه خدمت الزامی است' },
        { status: 400 }
      );
    }

    // Convert duration to number if it exists
    if (updateData.duration) {
      updateData.duration = Number(updateData.duration);
    }

    await Service.update(db, _id, updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/services:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی خدمت' },
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
        { error: 'شناسه خدمت الزامی است' },
        { status: 400 }
      );
    }

    await Service.delete(db, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/services:', error);
    return NextResponse.json(
      { error: 'خطا در حذف خدمت' },
      { status: 500 }
    );
  }
} 