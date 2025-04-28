import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Page from '@/models/Page';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const pages = await Page.findAll(db);
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'خطا در دریافت برگه‌ها' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, slug, content, customStyle, displayStyle } = data;

    if (!title) {
      return NextResponse.json({ error: 'عنوان الزامی است' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Generate slug if not provided
    const pageSlug = slug || Page.generateSlug(title);

    // Check if slug already exists
    const existingPage = await Page.findBySlug(db, pageSlug);
    if (existingPage) {
      return NextResponse.json({ error: 'این پیوند قبلاً استفاده شده است' }, { status: 400 });
    }

    const pageData = {
      title,
      slug: pageSlug,
      content: content || '',
      customStyle: customStyle || '',
      displayStyle: displayStyle || 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const pageId = await Page.create(db, pageData);
    return NextResponse.json({ id: pageId, ...pageData });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'خطا در ایجاد برگه' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, title, slug, content, customStyle, displayStyle } = data;

    if (!id || !title) {
      return NextResponse.json({ error: 'شناسه و عنوان الزامی هستند' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Generate slug if not provided
    const pageSlug = slug || Page.generateSlug(title);

    // Check if slug already exists for another page
    const existingPage = await Page.findBySlug(db, pageSlug);
    if (existingPage && existingPage._id.toString() !== id) {
      return NextResponse.json({ error: 'این پیوند قبلاً استفاده شده است' }, { status: 400 });
    }

    const updateData = {
      title,
      slug: pageSlug,
      content: content || '',
      customStyle: customStyle || '',
      displayStyle: displayStyle || 'default',
      updatedAt: new Date()
    };

    await Page.update(db, new ObjectId(id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'خطا در ویرایش برگه' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'شناسه الزامی است' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    await Page.delete(db, new ObjectId(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'خطا در حذف برگه' }, { status: 500 });
  }
} 