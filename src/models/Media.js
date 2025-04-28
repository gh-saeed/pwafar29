import { clientPromise } from '@/lib/mongodb';

class Media {
  static async create(db, mediaData) {
    const collection = db.collection('media');
    const result = await collection.insertOne(mediaData);
    return result.insertedId;
  }

  static async findAll(db) {
    const collection = db.collection('media');
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async findById(db, id) {
    const collection = db.collection('media');
    return await collection.findOne({ _id: id });
  }

  static async update(db, id, updateData) {
    const collection = db.collection('media');
    return await collection.updateOne(
      { _id: id },
      { $set: updateData }
    );
  }

  static async delete(db, id) {
    const collection = db.collection('media');
    return await collection.deleteOne({ _id: id });
  }

  static async deleteMany(db, ids) {
    const collection = db.collection('media');
    return await collection.deleteMany({ _id: { $in: ids } });
  }
}

export default Media; 