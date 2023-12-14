import { IImage } from './interfaces';

import DB from '../lib/DB';

const collection = 'Image';
const unsynched = 'Unsynched' + collection;

const Image = {
    get: async (id: string) => {
        return await DB.read<IImage>(collection, id);
    },
    set: async (image: IImage) => {
        if (!(await DB.read(collection, image._id)))
            return await DB.create(collection, image);
        await DB.update<IImage>(collection, image);
    },
    delete: async (id: string) => {
        await DB.delete<IImage>(collection, id);
    },
    getAll: async () => {
        return await DB.getCollection<IImage>(collection);
    },
    getUnsynched: async (id: string) => {
        return await DB.read<IImage>(unsynched, id);
    },
    setUnsynched: async (image: IImage) => {
        if (!(await DB.read(unsynched, image._id)))
            return await DB.create(unsynched, image);
        await DB.update<IImage>(unsynched, image);
    },
    deleteUnsynched: async (id: string) => {
        await DB.delete<IImage>(unsynched, id);
    },
    getAllUnsynched: async () => {
        return await DB.getCollection<IImage>(unsynched);
    },
    markAsSynched: async (image: IImage) => {
        await DB.delete(unsynched, image._id);
        await DB.create(collection, image);
    },
    markAsUnsynched: async (image: IImage) => {
        await DB.delete(collection, image._id);
        await DB.create(unsynched, image);
    },
};

export default Image;
