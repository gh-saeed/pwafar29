import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import RssFeed from '@/models/RssFeed';
import { ObjectId } from 'mongodb';
import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'mediaThumbnail', { keepArray: true }],
      ['media:content', 'mediaContent', { keepArray: true }]
    ]
  }
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get all active RSS feeds
    const feeds = await RssFeed.findAll(db);
    
    // Format the feeds for the news section
    // const formattedFeeds = await Promise.all(feeds.map(async (feed) => {
    //   try {
    //     // Parse RSS feed
    //     const feedData = await parser.parseURL((feed.url));
    //     console.log(feedData);
        
        
    //     return {
    //       id: feed._id.toString(),
    //       title: feed.name || 'بدون عنوان',
    //       color: "bg-teal-500",
    //       news: feedData.items.map(item => ({
    //         id: item.guid || item.link || Math.random().toString(),
    //         title: item.title || 'بدون عنوان',
    //         description: item.contentSnippet || item.description || 'بدون توضیحات',
    //         image: item.enclosure?.url || item.itunes?.image || "https://via.placeholder.com/40",
    //         link: item.link || '#',
    //         pubDate: item.pubDate || new Date().toISOString()
    //       }))
    //     };
    //   } catch (error) {
    //     console.error(`Error parsing feed ${feed.url}:`, error);
    //     return {
    //       id: feed._id.toString(),
    //       title: feed.name || 'بدون عنوان',
    //       color: "bg-teal-500",
    //       news: []
    //     };
    //   }
    // }));

    const formattedFeeds = await Promise.all(feeds.map(async (feed) => {
      try {
        // Parse RSS feed
        const feedData = await parser.parseURL((feed.url));
        
        return {
          id: feed._id.toString(),
          title: feed.name || 'بدون عنوان',
          color: "bg-teal-500",
          news: feedData.items.map(item => {
            // استخراج عکس از media:thumbnail یا media:content
            let imageUrl = null;
            
            if (item.mediaThumbnail && item.mediaThumbnail[0]?.$?.url) {
              imageUrl = item.mediaThumbnail[0].$.url;
            } else if (item.mediaContent && item.mediaContent[0]?.$?.url) {
              imageUrl = item.mediaContent[0].$.url;
            }
            
            return {
              id: item.guid || item.link || Math.random().toString(),
              title: item.title || 'بدون عنوان',
              description: item.contentSnippet || item.description || 'بدون توضیحات',
              image: imageUrl || item.enclosure?.url || item.itunes?.image || "https://via.placeholder.com/40",
              link: item.link || '#',
              pubDate: item.pubDate || new Date().toISOString()
            };
          })
        };
      } catch (error) {
        console.error(`Error parsing feed ${feed.url}:`, error);
        return {
          id: feed._id.toString(),
          title: feed.name || 'بدون عنوان',
          color: "bg-teal-500",
          news: []
        };
      }
    }));

    return NextResponse.json(formattedFeeds || []);
  } catch (error) {
    console.error('Error in RSS news API:', error);
    return NextResponse.json([], { status: 200 });
  }
} 