import { IClient } from './interfaces';

import DB from '../lib/DB';

const collection = 'Client';
const unsynched = 'Unsynched' + collection;

const Client = {
    get: async (id: string) => {
        return await DB.read<IClient>(collection, id);
    },
    set: async (client: IClient) => {
        if (client.deleted) return await Client.delete(client._id);
        if (!(await DB.read(collection, client._id)))
            return await DB.create(collection, client);
        await DB.update<IClient>(collection, client);
    },
    delete: async (id: string) => {
        return await DB.delete<IClient>(collection, id);
    },
    getAll: async () => {
        return await DB.getCollection<IClient>(collection);
    },
    setUnsynched: async (client: IClient) => {
        if (!(await DB.read(unsynched, client._id)))
            return await DB.create(unsynched, client);
        await DB.update<IClient>(unsynched, client);
    },
    deleteUnsynched: async (id: string) => {
        return await DB.delete<IClient>(unsynched, id);
    },
    getAllUnsynched: async () => {
        return await DB.getCollection<IClient>(unsynched);
    },
};

export default Client;
