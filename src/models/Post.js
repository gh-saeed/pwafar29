import { ObjectId } from 'mongodb';

class Post {
  static async create(db, postData) {
    const collection = db.collection('posts');
    const result = await collection.insertOne({
      ...postData,
      pageIds: postData.pageIds || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async findAll(db) {
    const collection = db.collection('posts');
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async findById(db, id) {
    const collection = db.collection('posts');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async findBySlug(db, slug) {
    const collection = db.collection('posts');
    return await collection.findOne({ slug });
  }

  static async findByPageId(db, pageId) {
    const collection = db.collection('posts');
    return await collection.find({ pageIds: pageId }).sort({ createdAt: -1 }).toArray();
  }

  static async update(db, id, updateData) {
    const collection = db.collection('posts');
    return await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
  }

  static async delete(db, id) {
    const collection = db.collection('posts');
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }

  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export default Post; 