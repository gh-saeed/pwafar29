import { ObjectId } from 'mongodb';

class Service {
  constructor({
    _id,
    name,
    description,
    price,
    category,
    duration,
    image,
    features = [],
    createdAt = new Date(),
    updatedAt = new Date(),
    isActive = true
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.name = name;
    this.description = description;
    this.price = price;
    this.category = category;
    this.duration = duration;
    this.image = image;
    this.features = features;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.isActive = isActive;
  }

  static async create(db, data) {
    const service = {
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category || null,
      duration: data.duration || null,
      image: data.image || null,
      features: data.features || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const result = await db.collection('services').insertOne(service);
    return result.insertedId;
  }

  static async findAll(db) {
    try {
      const services = await db.collection('services')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return services;
    } catch (error) {
      console.error('Error in Service.findAll:', error);
      throw error;
    }
  }

  static async findById(db, id) {
    try {
      return await db.collection('services').findOne({ 
        _id: new ObjectId(id) 
      });
    } catch (error) {
      console.error('Error in Service.findById:', error);
      throw error;
    }
  }

  static async findByCategory(db, category) {
    try {
      return await db.collection('services')
        .find({ category })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (error) {
      console.error('Error in Service.findByCategory:', error);
      throw error;
    }
  }

  static async update(db, id, data) {
    try {
      const updateData = {
        ...data,
        updatedAt: new Date()
      };

      return await db.collection('services').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );
    } catch (error) {
      console.error('Error in Service.update:', error);
      throw error;
    }
  }

  static async delete(db, id) {
    try {
      return await db.collection('services').deleteOne({
        _id: new ObjectId(id)
      });
    } catch (error) {
      console.error('Error in Service.delete:', error);
      throw error;
    }
  }
}

export default Service; 