import {Db, MongoClient} from 'mongodb';
import logger from "../util/logger";

class DbClient {
    // MARK: Properties

    private url = 'mongodb://scheduling:golla1994@ds121652.mlab.com:21652/scheduling';
    private dbName = 'scheduling';

    public mongoClient!: MongoClient;
    public db!: Db;

    // MARK: Public methods
    public async connect() {
        try {
            this.mongoClient = await MongoClient.connect(this.url, {useNewUrlParser: true});
            logger.log('Connected successfully to database');
            this.db = this.mongoClient.db(this.dbName);
            await this.createCollections();
            return this.db;
        } catch (error) { console.log('MongoDB url host unreachable!'); }
    }

    // Scan/Query
    public findOne(query: any, collection: string) {
        return this.db.collection(collection).findOne(query);
    }
    public find(query: any, collection: string, projection = {}) {
        return this.db.collection(collection).find(query, projection).toArray();
    }
    // Insert
    public insertOne(data: any, collection: string) {
        return this.db.collection(collection).insertOne(data);
    }
    public insertMany(array: any[], collection: string) {
        return this.db.collection(collection).insertMany(array);
    }
    // Update
    public update(query: any, set: any, collection: string) {
        return this.db.collection(collection).update(query, set);
    }
    public updateOne(query: any, set: any, collection: string) {
        return this.db.collection(collection).updateOne(query, set);
    }
    // Save
    public save(data: any, collection: string) {
        return this.db.collection(collection).save(data);
    }
    // Delete
    public deleteOne(data: any, collection: string) {
        return this.db.collection(collection).deleteOne(data);
    }

    // MARK: Private methods
    private async createCollections() {
        await this.db.createCollection('users',
            { validator: { $and:
                [
                    {username: {$exists: true}},
                    {postKey: {$exists: true}},
                    {publicKey: {$exists: true}}
                ]
            }
        });
        await this.db.createCollection('videos',
            { validator: { $and:
                        [
                            {username: {$exists: true}},
                            {title: {$exists: true}},
                            {thumbnail: {$exists: true}},
                            {data: {$exists: true}},
                            {scheduled: {$exists: true}},
                            {shareInfo: {$exists: true}},
                            {ipfs: {$exists: true}},
                            {uploaded: {$exists: true}},
                            {logs: {$exists: true}},
                            {completed: {$exists: true}}
                        ]
                }
            });
        await this.db.collection('videos').createIndex({username: 1, uploaded: 1});
    }
}
let DBClient = new DbClient();
export default DBClient;
