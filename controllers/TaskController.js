import TaskActiveModule from '../models/TaskActive.js'
import TaskFulfilledModule from '../models/TaskFulfilled.js'
import {taskWeekCreatedUpdate, taskWeekDeletedUpdate, taskWeekFulfilledUpdate} from "./StatisticsController.js";




export async function getAllTask(req, res) {
    try {
        const taskActive = await TaskActiveModule.find(
            {
                user: req.userId,
                categories: req.params.id.toString()

            })
        const taskFulfilled = await TaskFulfilledModule.find(
            {
                user: req.userId,
                categories: req.params.id

            })

        res.json({
            taskActive: taskActive,
            taskFulfilled: taskFulfilled
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить задачи'
        })
    }
}


export async function taskCreate(req, res){
    try {
        const doc = new TaskActiveModule({
            name: req.body.name,
            categories: req.body.categoriesId,
            user: req.userId
        })

        const task = await doc.save()
        const {user, ...taskData} = task._doc

        const statistics = await taskWeekCreatedUpdate(req.body.weekData, req.userId, req.body.weekDay, 1)

        res
            .status(200)
            .json({
                taskData,
                statistics
            })
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: 'Не удалось создать задачу',
            })
    }
}

export async function updateTask(req, res) {
    try {
        const doc = await TaskActiveModule.updateOne(
            {
                _id: req.body.id,
                user: req.userId
            }, {
                name: req.body.name
            })

        if (!doc.matchedCount) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найдена задача'
                })
        }

        res
            .status(200)
            .json({
                update: true
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить задачау'
        })
    }
}
export async function taskDeleted(req, res){
    try {
        const deletedTask = await TaskActiveModule.findOneAndDelete(
            {
                _id: req.params.id.toString(),
                user: req.userId
            }
        )
        if(!deletedTask) {
            return res
                .status(400)
                .json({
                    message: 'Неверный id задачи или нет доступа для её удаления'
                })
        }

        const statistics = await taskWeekDeletedUpdate(req.params.weekData.toString(), req.userId, 1)

        res
            .status(200)
            .json({
                statistics
            })
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: 'Не удалось удалить задачу',
            })
    }
}




export async function taskFulfilled(req, res){
    try {
        const deletedTask = await TaskActiveModule.findOneAndDelete(
            {
                _id: req.body.id,
                user: req.userId
            }
        )
        if(!deletedTask) {
            return res
                .status(400)
                .json({
                    message: 'Неверный id задачи или нет доступа для её удаления'
                })
        }
        const doc = new TaskFulfilledModule({
            name: deletedTask.name,
            categories: deletedTask.categories,
            user: req.userId
        })

        const task = await doc.save()
        const {user, ...taskData} = task._doc

        const statistics = await taskWeekFulfilledUpdate(req.body.weekData, req.userId, req.body.weekDay, 1)

        res
            .status(200)
            .json({
                taskData,
                statistics
            })
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: 'Не удалось выполнить задачу',
            })
    }
}


