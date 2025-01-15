const { ObjectId } = require('mongodb');
const Promise = require('bluebird');
const { itemsPerPage } = require('../utils/config');
const { filter, isArray, partition, map, extend, get } = require('lodash');

class BaseModel {
    constructor(db, collectionName, context) {
        this.db = db; 
        this.collectionName = collectionName;
        this.context = context;
        this.collection = this.db.collection(collectionName);
    }

    async getAll(queryText, paging) {
        const { limit = itemsPerPage, offset = 0 } = paging || {};
        const query = {$text: {$search: queryText}}
        const cursor = this.collection.find(query).skip(offset).limit(limit);
        const items = await cursor.toArray();
        const totalItems = await this.collection.countDocuments(query);
        return {
            paging: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: Math.floor(offset / limit) + 1,
            },
            items,
        };
    }

    async getById(id) {
        if (!ObjectId.isValid(id)) return null;
        return this.collection.findOne({ _id: new ObjectId(id) });
    }

    async getByField(field, value, paging) {
        const { limit = itemsPerPage, offset = 0 } = paging || {};
        const query = { [field]: value };
        const cursor = this.collection.find(query).skip(offset).limit(limit);
        const items = await cursor.toArray();
        const totalItems = await this.collection.countDocuments(query);
        return {
            paging: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: Math.floor(offset / limit) + 1,
            },
            items,
        };
    }

    async save(input) {
        if (isArray(input)) {
            const [updates, inserts] = partition(input, 'id');
            const bulkOps = [];

            inserts.forEach(item => {
                bulkOps.push({
                    insertOne: {
                        document: { ...item },
                    },
                });
            });

            updates.forEach(item => {
                const { id, ...updateFields } = item;
                bulkOps.push({
                    updateOne: {
                        filter: { _id: new ObjectId(id) },
                        update: { $set: updateFields },
                    },
                });
            });

            if (bulkOps.length > 0) {
                await this.collection.bulkWrite(bulkOps);
            }
        } else if (!input.id) {
            const result = await this.collection.insertOne(input);
            return result.insertedId;
        } else {
            const { id, ...updateFields } = input;
            await this.collection.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });
            return id;
        }
    }

    async addEvent(type, streamType, payload) {
        const transformedPayload = transformToSnakeCase(payload);
        return this.collection.insertOne({
            type,
            streamType,
            payload: transformedPayload,
            streamId: transformedPayload.id,
        });
    }

    async deleteById(id) {
        if (!ObjectId.isValid(id)) return null;
        return this.collection.deleteOne({ _id: new ObjectId(id) });
    }

    async deleteWhereIn(ids) {
        const validIds = ids.filter(id => ObjectId.isValid(id)).map(id => new ObjectId(id));
        return this.collection.deleteMany({ _id: { $in: validIds } });
    }

    async softDelete(id) {
        if (!ObjectId.isValid(id)) return null;
        return this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { deleted: true } });
    }

    async restore(id) {
        if (!ObjectId.isValid(id)) return null;
        return this.collection.updateOne({ _id: new ObjectId(id) }, { $set: { deleted: false } });
    }

    async hardDelete(id) {
        return this.deleteById(id);
    }

    async resolvePagedQuery(query, paging) {
        const { limit = itemsPerPage, offset = 0 } = paging || {};
        const cursor = this.collection.find(query).skip(offset).limit(limit);
        const items = await cursor.toArray();
        const totalItems = await this.collection.countDocuments(query);
        return {
            paging: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: Math.floor(offset / limit) + 1,
            },
            items,
        };
    }

    async getCount(query = {}) {
        return this.collection.countDocuments(query);
    }
}

module.exports = BaseModel;
