import { ObjectId } from 'mongodb';

class UserSubscription {
  constructor({
    _id,
    userId,
    serviceId,
    startDate = new Date(),
    endDate,
    isActive = true,
    createdAt = new Date(),
    updatedAt = new Date(),
  }) {
    this._id = _id ? new ObjectId(_id) : new ObjectId();
    this.userId = new ObjectId(userId);
    this.serviceId = new ObjectId(serviceId);
    this.startDate = startDate;
    this.endDate = endDate;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(db, subscriptionData) {
    const subscriptions = db.collection('userSubscriptions');
    const result = await subscriptions.insertOne(new UserSubscription(subscriptionData));
    return result.insertedId;
  }

  static async findAll(db, query = {}) {
    const subscriptions = db.collection('userSubscriptions');
    return await subscriptions.find(query).toArray();
  }

  static async findById(db, id) {
    const subscriptions = db.collection('userSubscriptions');
    return await subscriptions.findOne({ _id: new ObjectId(id) });
  }

  static async findByUserId(db, userId) {
    const subscriptions = db.collection('userSubscriptions');
    return await subscriptions.find({ userId: new ObjectId(userId) }).toArray();
  }

  static async update(db, id, updateData) {
    const subscriptions = db.collection('userSubscriptions');
    updateData.updatedAt = new Date();
    return await subscriptions.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
  }

  static async delete(db, id) {
    const subscriptions = db.collection('userSubscriptions');
    return await subscriptions.deleteOne({ _id: new ObjectId(id) });
  }
}

export default UserSubscription; 