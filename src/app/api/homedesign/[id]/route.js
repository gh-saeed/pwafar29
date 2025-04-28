import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db('faraplattform');
    const { id } = params;
    const result = await db.collection('homedesigns').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'بخش با موفقیت حذف شد', result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}