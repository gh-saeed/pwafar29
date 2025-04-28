import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('menu_items').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'آیتم منو یافت نشد' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'آیتم منو با موفقیت حذف شد' });
  } catch (error) {
    console.error('Error in DELETE /api/settings/navmobile/[id]:', error);
    return NextResponse.json(
      { error: 'خطا در حذف آیتم منو' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { direction } = await request.json();
    const client = await clientPromise;
    const db = client.db();

    const currentItem = await db.collection('menu_items').findOne({
      _id: new ObjectId(id)
    });

    if (!currentItem) {
      return NextResponse.json(
        { error: 'آیتم منو یافت نشد' },
        { status: 404 }
      );
    }

    const targetOrder = direction === 'up' 
      ? currentItem.order - 1 
      : currentItem.order + 1;

    const targetItem = await db.collection('menu_items').findOne({
      order: targetOrder
    });

    if (targetItem) {
      // Swap orders
      await db.collection('menu_items').updateOne(
        { _id: new ObjectId(id) },
        { $set: { order: targetOrder } }
      );

      await db.collection('menu_items').updateOne(
        { _id: targetItem._id },
        { $set: { order: currentItem.order } }
      );
    }

    return NextResponse.json({ message: 'ترتیب آیتم‌ها با موفقیت بروزرسانی شد' });
  } catch (error) {
    console.error('Error in PUT /api/settings/navmobile/[id]:', error);
    return NextResponse.json(
      { error: 'خطا در بروزرسانی ترتیب آیتم‌ها' },
      { status: 500 }
    );
  }
} 