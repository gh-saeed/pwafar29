import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import Post from '@/models/Post';
import Page from '@/models/Page';
import LayoutClient from '@/components/LayoutClient';

export async function generateMetadata({ params }) {
  const { slug, postSlug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedPostSlug = decodeURIComponent(postSlug);
  
  const client = await clientPromise;
  const db = client.db();
  
  const page = await Page.findBySlug(db, decodedSlug);
  const post = await Post.findBySlug(db, decodedPostSlug);

  if (!page || !post) {
    return {
      title: 'صفحه یافت نشد',
    };
  }

  return {
    title: `${post.title} - ${page.title}`,
  };
}

export default async function PostPage({ params }) {
  const { slug, postSlug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const decodedPostSlug = decodeURIComponent(postSlug);
  
  const client = await clientPromise;
  const db = client.db();
  
  const page = await Page.findBySlug(db, decodedSlug);
  const post = await Post.findBySlug(db, decodedPostSlug);

  if (!page || !post) {
    notFound();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <LayoutClient>
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
    <div className="px-4 py-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {post.image && (
          <div className="aspect-video">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span>{formatDate(post.updatedAt)}</span>
            {post.tags.length > 0 && (
              <div className="flex gap-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {post.summary && (
            <div className="prose prose-sm max-w-none mb-4">
              <p className="text-gray-600">{post.summary}</p>
            </div>
          )}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
    </div>
    </LayoutClient>
  );
} 