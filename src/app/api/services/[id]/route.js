import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Service from '@/models/Service';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const service = await Service.findById(db, id);
    
    if (!service) {
      return NextResponse.json(
        { error: 'سرویس مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در دریافت سرویس' },
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
    const result = await Service.update(db, id, updateData);
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'سرویس مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در بروزرسانی سرویس' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const result = await Service.delete(db, id);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'سرویس مورد نظر یافت نشد' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در حذف سرویس' },
      { status: 500 }
    );
  }
} 