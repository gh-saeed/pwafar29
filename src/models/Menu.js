import { ObjectId } from 'mongodb';

class Menu {
  constructor({
    _id,
    title,
    url,
    icon,
    order = 0,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.title = title;
    this.url = url;
    this.icon = icon;
    this.order = order;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(db, data) {
    if (!data.title || !data.url) {
      throw new Error('عنوان و آدرس منو اجباری هستند');
    }

    const result = await db.collection('menus').insertOne({
      title: data.title,
      url: data.url,
      icon: data.icon || '',
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async findAll(db) {
    return await db.collection('menus')
      .find()
      .sort({ order: 1 })
      .toArray();
  }

  static async findById(db, id) {
    return await db.collection('menus').findOne({ _id: new ObjectId(id) });
  }

  static async update(db, id, data) {
    const result = await db.collection('menus').updateOne(
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
    const result = await db.collection('menus').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  static async updateOrder(db, id, order) {
    const result = await db.collection('menus').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          order,
          updatedAt: new Date()
        }
      }
    );
    return result.modifiedCount > 0;
  }
}

export default Menu; 