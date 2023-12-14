// import Activity from './Activity';
// import Branch from './Branch';
// import { IActivity, IBranch, ITask } from './interfaces';

// import DB from '../lib/DB';
// const collection = 'Task';
// const unsynched = 'Unsynched' + collection;

// const Task = {
//     get: async (id: string) => {
//         const task = await DB.read<ITask>(collection, id);
//         if (!task) return {} as ITask;
//         task.branch = await Branch.get(task.branch as string);
//         return task;
//     },
//     set: async (task: ITask) => {
//         await Branch.set(task.branch as IBranch);
//         if (task.activity && !task.deleted) {
//             await Activity.set(task.activity as IActivity);
//             task.activity = (task.activity as IActivity)._id;
//         }

//         if (task.deleted) return await Task.delete(task._id as string);
//         task.branch = (task.branch as IBranch)._id;
//         const existingTask = await DB.read<ITask>(collection, task._id as string);

//         //if no task is found, we create it
//         if (!existingTask) return await DB.create(collection, task);
//         //otherwise we update it
//         await DB.update<ITask>(collection, task);
//     },
//     delete: async (id: string) => {
//         await DB.delete<ITask>(collection, id);
//     },
//     getAll: async () => {
//         return await Promise.all(
//             (await DB.getCollection<ITask>(collection)).map(
//                 async (task: ITask) => await Task.get(task._id as string),
//             ),
//         );
//     },
//     setUnsynched: async (task: ITask) => {
//         if (!(await DB.read(unsynched, task._id as string)))
//             return await DB.create(unsynched, task);
//         return await DB.update<ITask>(unsynched, task);
//     },
//     deleteUnsynched: async (id: string) => {
//         return await DB.delete<ITask>(unsynched, id);
//     },
//     getAllUnsynched: async () => {
//         return await Promise.all(
//             (await DB.getCollection<ITask>(unsynched)).map(
//                 async (task: ITask) => await Task.get(task._id as string),
//             ),
//         );
//     },
//     markAsSynched: async (task: ITask) => {
//         await DB.delete(unsynched, task._id as string);
//         await DB.create(collection, task);
//     },
//     markAsUnsynched: async (task: ITask) => {
//         await DB.delete(collection, task._id as string);
//         await DB.create(unsynched, task);
//     },
// };

// export default Task;
