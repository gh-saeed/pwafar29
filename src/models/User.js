import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

class User {
  constructor({
    _id,
    mobile,
    name,
    role = 'user',
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.mobile = mobile;
    this.name = name || '';
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(db, data) {
    // Check if mobile number already exists
    const existingUser = await this.findByMobile(db, data.mobile);
    if (existingUser) {
      throw new Error('این شماره موبایل قبلاً ثبت شده است');
    }

    const user = {
      name: data.name,
      mobile: data.mobile,
      role: data.role || 'user',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    return result.insertedId;
  }

  static async findAll(db) {
    return await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
  }

  static async findById(db, id) {
    return await db.collection('users').findOne({ 
      _id: new ObjectId(id) 
    });
  }

  static async findByMobile(db, mobile) {
    return await db.collection('users').findOne({ mobile });
  }

  static async update(db, id, data) {
    // Check if mobile is being updated and if it already exists
    if (data.mobile) {
      const existingUser = await this.findByMobile(db, data.mobile);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error('این شماره موبایل قبلاً ثبت شده است');
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    return await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async delete(db, id) {
    return await db.collection('users').deleteOne({
      _id: new ObjectId(id)
    });
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }
}

export default User; 