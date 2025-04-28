import { ObjectId } from 'mongodb';

class Banner {
  constructor({
    _id,
    title,
    description,
    imageUrl,
    linkUrl,
    order = 0,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.title = title || '';
    this.description = description || '';
    this.imageUrl = imageUrl || '';
    this.linkUrl = linkUrl || '';
    this.order = order;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(db, data) {
    const banner = {
      title: data.title || '',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      linkUrl: data.linkUrl || '',
      order: data.order || 0,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('banners').insertOne(banner);
    return result.insertedId;
  }

  static async findAll(db) {
    return await db.collection('banners')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
  }

  static async findActive(db) {
    return await db.collection('banners')
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .toArray();
  }

  static async findById(db, id) {
    return await db.collection('banners').findOne({ 
      _id: new ObjectId(id) 
    });
  }

  static async update(db, id, data) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    return await db.collection('banners').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async delete(db, id) {
    return await db.collection('banners').deleteOne({
      _id: new ObjectId(id)
    });
  }
}

export default Banner; 