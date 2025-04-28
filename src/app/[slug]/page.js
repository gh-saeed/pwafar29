import { notFound } from 'next/navigation';
import clientPromise from '@/lib/mongodb';
import Page from '@/models/Page';
import Post from '@/models/Post';
import Link from 'next/link';
import LayoutClient from '@/components/LayoutClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const client = await clientPromise;
  const db = client.db();
  const page = await Page.findBySlug(db, decodedSlug);
  
  if (!page) {
    return {
      title: 'صفحه پیدا نشد'
    };
  }

  return {
    title: page.title
  };
}

export default async function DynamicPage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const client = await clientPromise;
  const db = client.db();
  const page = await Page.findBySlug(db, decodedSlug);

  if (!page) {
    notFound();
  }

  // Fetch related posts
  const posts = await Post.findByPageId(db, page._id.toString());

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const displayStyle = Page.getDisplayStyles().find(style => style.id === page.displayStyle);
  const renderedContent = displayStyle ? displayStyle.template(page) : '';

  return (
    <LayoutClient>
    <div className="max-w-md mx-auto bg-slate-100 min-h-screen flex flex-col pt-24 pb-24">
    <div className="px-4 py-4">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
        <div className="p-4">
          <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
          {page.customStyle && (
            <style>{page.customStyle}</style>
          )}
        </div>
      </div>

      {/* Related Posts Section */}
      {posts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-gray-800">نوشته‌های مرتبط</h2>
          </div>
          <div className="divide-y">
            {posts.map((post) => (
              <Link
                key={post._id}
                href={`/${slug}/${post.slug}`}
                className="block hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="p-4">
                  {/* {post.image && (
                    <div className="aspect-video mb-3">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )} */}
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {post.summary}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(post.updatedAt)}</span>
                    {post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
    </LayoutClient>
  );
} 