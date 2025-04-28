import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import RssFeed from '@/models/RssFeed';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const feeds = await RssFeed.findAll(db);
    return NextResponse.json(feeds);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();
    
    const feedId = await RssFeed.create(db, body);
    const feed = await RssFeed.findById(db, feedId);
    
    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 