import { ObjectId } from 'mongodb';

class Notification {
  constructor({
    _id,
    title,
    message,
    type = 'info',
    isRead = false,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.title = title;
    this.message = message;
    this.type = type;
    this.isRead = isRead;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(db, data) {
    if (!data.title || !data.message) {
      throw new Error('عنوان و متن اعلان اجباری هستند');
    }

    const result = await db.collection('notifications').insertOne({
      title: data.title,
      message: data.message,
      type: data.type || 'info',
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async findAll(db, query = {}) {
    return await db.collection('notifications')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findById(db, id) {
    return await db.collection('notifications').findOne({ _id: new ObjectId(id) });
  }

  static async update(db, id, data) {
    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...data,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  static async delete(db, id) {
    const result = await db.collection('notifications').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async markAsRead(db, id) {
    const result = await db.collection('notifications').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          isRead: true,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }

  static async getUnreadCount(db) {
    return await db.collection('notifications').countDocuments({ isRead: false });
  }
}

export default Notification; 