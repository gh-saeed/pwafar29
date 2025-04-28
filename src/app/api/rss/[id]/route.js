import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import RssFeed from '@/models/RssFeed';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();

    await RssFeed.update(db, new ObjectId(id), body);
    const feed = await RssFeed.findById(db, new ObjectId(id));
    
    if (!feed) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }

    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db();

    const result = await RssFeed.delete(db, new ObjectId(id));
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Feed not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Feed deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 