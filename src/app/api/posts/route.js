import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Post from '@/models/Post';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    const client = await clientPromise;
    const db = client.db();

    let posts;
    if (pageId) {
      posts = await Post.findByPageId(db, pageId);
    } else {
      posts = await Post.findAll(db);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'خطا در دریافت نوشته‌ها' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, slug, content, summary, tags, image, pageIds } = data;

    if (!title) {
      return NextResponse.json({ error: 'عنوان الزامی است' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Generate slug if not provided
    const postSlug = slug || Post.generateSlug(title);

    // Check if slug already exists
    const existingPost = await Post.findBySlug(db, postSlug);
    if (existingPost) {
      return NextResponse.json({ error: 'این پیوند قبلاً استفاده شده است' }, { status: 400 });
    }

    const postData = {
      title,
      slug: postSlug,
      content: content || '',
      summary: summary || '',
      tags: tags || [],
      image: image || '',
      pageIds: pageIds || [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const postId = await Post.create(db, postData);
    return NextResponse.json({ id: postId, ...postData });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'خطا در ایجاد نوشته' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    const { id, title, slug, content, summary, tags, image, pageIds } = data;

    if (!id || !title) {
      return NextResponse.json({ error: 'شناسه و عنوان الزامی هستند' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Generate slug if not provided
    const postSlug = slug || Post.generateSlug(title);

    // Check if slug already exists for another post
    const existingPost = await Post.findBySlug(db, postSlug);
    if (existingPost && existingPost._id.toString() !== id) {
      return NextResponse.json({ error: 'این پیوند قبلاً استفاده شده است' }, { status: 400 });
    }

    const updateData = {
      title,
      slug: postSlug,
      content: content || '',
      summary: summary || '',
      tags: tags || [],
      image: image || '',
      pageIds: pageIds || [],
      updatedAt: new Date()
    };

    await Post.update(db, new ObjectId(id), updateData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'خطا در ویرایش نوشته' }, { status: 500 });
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
    await Post.delete(db, new ObjectId(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'خطا در حذف نوشته' }, { status: 500 });
  }
} 