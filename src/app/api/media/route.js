import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Media from '@/models/Media';
import sharp from 'sharp';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

const ffmpegPromise = promisify(ffmpeg);

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const media = await Media.findAll(db);
    return NextResponse.json(media);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const format = formData.get('format') || 'webp';
    const quality = parseInt(formData.get('quality') || '80');
    const type = formData.get('type') || 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}.${type === 'video' ? 'mp4' : format}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(uploadDir, filename);

    if (type === 'video') {
      // Save temporary file
      const tempPath = join(uploadDir, `temp_${filename}`);
      await writeFile(tempPath, buffer);

      // Process video with ffmpeg
      await new Promise((resolve, reject) => {
        ffmpeg(tempPath)
          .outputOptions([
            '-c:v libx264',
            '-preset medium',
            '-crf 28',
            '-c:a aac',
            '-b:a 128k'
          ])
          .toFormat('mp4')
          .on('end', () => {
            unlink(tempPath).then(resolve).catch(reject);
          })
          .on('error', reject)
          .save(filepath);
      });
    } else {
      // Process image with sharp
      const processedImage = await sharp(buffer)
        .toFormat(format, { quality })
        .toBuffer();
      await writeFile(filepath, processedImage);
    }

    // Save to database
    const client = await clientPromise;
    const db = client.db();
    const mediaData = {
      filename,
      format: type === 'video' ? 'mp4' : format,
      size: type === 'video' ? buffer.length : buffer.length,
      path: `/uploads/${filename}`,
      type,
      createdAt: new Date(),
    };

    const mediaId = await Media.create(db, mediaData);

    return NextResponse.json({ id: mediaId, ...mediaData });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json({ error: 'Failed to upload media' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, filename } = await request.json();
    
    if (!id || !filename) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    await Media.update(db, new ObjectId(id), { filename });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating filename:', error);
    return NextResponse.json({ error: 'Failed to update filename' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const filename = searchParams.get('filename');
    const ids = searchParams.get('ids');

    const client = await clientPromise;
    const db = client.db();

    if (ids) {
      // Delete multiple files
      const idArray = JSON.parse(ids);
      
      // Get filenames before deleting from database
      const mediaItems = await db.collection('media')
        .find({ _id: { $in: idArray.map(id => new ObjectId(id)) } })
        .toArray();
      
      // Delete from database
      await Media.deleteMany(db, idArray.map(id => new ObjectId(id)));
      
      // Delete files
      await Promise.all(mediaItems.map(async (item) => {
        const filePath = join(process.cwd(), 'public', item.path);
        try {
          await unlink(filePath);
        } catch (error) {
          console.error(`Error deleting file ${item.path}:`, error);
          // Continue with other files even if one fails
        }
      }));

      return NextResponse.json({ success: true });
    }

    if (!id || !filename) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get the media item to get the correct path
    const mediaItem = await Media.findById(db, new ObjectId(id));
    if (!mediaItem) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete from database
    await Media.delete(db, new ObjectId(id));

    // Delete file
    const filePath = join(process.cwd(), 'public', mediaItem.path);
    try {
      await unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${mediaItem.path}:`, error);
      // Continue even if file deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
} 