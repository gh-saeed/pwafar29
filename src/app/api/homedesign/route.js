import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('faraplattform');
    const sections = await db.collection('homedesigns').find().toArray();
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db('faraplattform');
    const body = await request.json();
    const section = await db.collection('homedesigns').insertOne(body);
    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const db = client.db('faraplattform');
    const { id, ...section } = await request.json();
    const result = await db.collection('homedesigns').updateOne(
      { _id: new ObjectId(id) },
      { $set: section }
    );
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const client = await clientPromise;
    const db = client.db('faraplattform');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const result = await db.collection('homedesigns').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}