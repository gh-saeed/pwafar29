class Page {
  static async create(db, pageData) {
    const collection = db.collection('pages');
    const result = await collection.insertOne({
      ...pageData,
      displayStyle: pageData.displayStyle || 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result.insertedId;
  }

  static async findAll(db) {
    const collection = db.collection('pages');
    return await collection.find({}).sort({ createdAt: -1 }).toArray();
  }

  static async findById(db, id) {
    const collection = db.collection('pages');
    return await collection.findOne({ _id: id });
  }

  static async findBySlug(db, slug) {
    const collection = db.collection('pages');
    return await collection.findOne({ slug });
  }

  static async update(db, id, updateData) {
    const collection = db.collection('pages');
    return await collection.updateOne(
      { _id: id },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
  }

  static async delete(db, id) {
    const collection = db.collection('pages');
    return await collection.deleteOne({ _id: id });
  }

  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\u0600-\u06FF\w]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  static getDisplayStyles() {
    return [
      {
        id: 'default',
        name: 'پیش‌فرض',
        template: (page) => `
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="prose prose-sm max-w-none">
              ${page.content}
            </div>
          </div>
        `
      },
      {
        id: 'card',
        name: 'کارت',
        template: (page) => `
          <div class="bg-gray-100 p-4 space-y-4">
            ${page.content ? `
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="prose prose-sm max-w-none">
                  ${page.content}
                </div>
              </div>
            ` : ''}
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              ${page.cards ? page.cards.map(card => `
                <div class="bg-white rounded-xl shadow-sm p-4 text-right">
                  <h2 class="text-sm font-medium text-gray-800">${card.title}</h2>
                  <p class="text-xs text-gray-400 mt-1">${card.date}</p>
                </div>
              `).join('') : ''}
            </div>
          </div>
        `
      },
      {
        id: 'list',
        name: 'لیست',
        template: `
          <div class="bg-white rounded-xl shadow-sm p-4 text-right">
            <h2 class="text-sm font-medium text-gray-800">{title}</h2>
            <p class="text-xs text-gray-400 mt-1">{date}</p>
            <ul class="mt-2 space-y-2">
              {content}
            </ul>
          </div>
        `
      }
    ];
  }
}

export default Page; 