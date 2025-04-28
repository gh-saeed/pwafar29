import { ObjectId } from 'mongodb';

class HomeDesign {
  constructor({
    _id,
    title,
    services = [],
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.title = title;
    this.services = services.map(service => ({
      title: service.title || '',
      icon: service.icon || '',
      href: service.href || ''
    }));
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(db, data) {
    const homeDesign = {
      title: data.title,
      services: data.services.map(service => ({
        title: service.title || '',
        icon: service.icon || '',
        href: service.href || ''
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('homedesigns').insertOne(homeDesign);
    return result.insertedId;
  }

  static async findAll(db) {
    return await db.collection('homedesigns')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findById(db, id) {
    return await db.collection('homedesigns').findOne({ 
      _id: new ObjectId(id) 
    });
  }

  static async update(db, id, data) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    return await db.collection('homedesigns').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async delete(db, id) {
    return await db.collection('homedesigns').deleteOne({
      _id: new ObjectId(id)
    });
  }
}

export default HomeDesign;