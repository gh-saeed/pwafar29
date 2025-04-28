import { ObjectId } from 'mongodb';

class RssFeed {
  static async create(db, feedData) {
    const collection = db.collection('rssfeeds');
    const result = await collection.insertOne({
      ...feedData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async findAll(db) {
    const collection = db.collection('rssfeeds');
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async findById(db, id) {
    const collection = db.collection('rssfeeds');
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  static async update(db, id, updateData) {
    const collection = db.collection('rssfeeds');
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
    const collection = db.collection('rssfeeds');
    return await collection.deleteOne({ _id: new ObjectId(id) });
  }
}

export default RssFeed; 