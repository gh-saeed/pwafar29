import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const settings = await db.collection('settings').findOne({ key: 'logo' });
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        text: '',
        imageUrl: '',
        useImage: false,
        useText: true,
      });
    }
    
    return NextResponse.json(settings.value);
  } catch (error) {
    console.error('Error fetching logo settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logo settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db();
    
    // Validate the data
    if (typeof data.text !== 'string' || typeof data.useText !== 'boolean' || 
        typeof data.useImage !== 'boolean' || typeof data.imageUrl !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }
    
    // Update or insert the settings
    await db.collection('settings').updateOne(
      { key: 'logo' },
      { $set: { value: data } },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving logo settings:', error);
    return NextResponse.json(
      { error: 'Failed to save logo settings' },
      { status: 500 }
    );
  }
} 