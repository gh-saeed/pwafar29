import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Menu from '@/models/Menu';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const menu = await Menu.findById(db, id);

    if (!menu) {
      return NextResponse.json(
        { error: 'آیتم منو یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json(menu);
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در دریافت آیتم منو' },
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
    const result = await Menu.update(db, id, updateData);

    if (!result) {
      return NextResponse.json(
        { error: 'آیتم منو یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'آیتم منو با موفقیت بروزرسانی شد' });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در بروزرسانی آیتم منو' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const result = await Menu.delete(db, id);

    if (!result) {
      return NextResponse.json(
        { error: 'آیتم منو یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'آیتم منو با موفقیت حذف شد' });
  } catch (error) {
    return NextResponse.json(
      { error: 'خطا در حذف آیتم منو' },
      { status: 500 }
    );
  }
} 