import CategoriesModel from '../models/Categories.js'
import TaskActiveModel from '../models/TaskActive.js'
import TaskFulfilledModel from '../models/TaskFulfilled.js'

export async function getCategories(req, res) {
    try {
        const categories = await CategoriesModel.find({user: `${req.userId}`})
        res.json(categories)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось получить категории'
        })
    }
}

export async function createCategories(req, res) {
    try {
        const doc = new CategoriesModel({
            name: req.body.name,
            iconName: req.body.iconName,
            user: req.userId
        })

        const {_doc} = await doc.save()
        res.json(_doc)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать категорию'
        })
    }
}

export async function updateCategories(req, res) {
    try {
        const doc = await CategoriesModel.updateOne(
            {
                _id: req.body.id,
                user: req.userId
            }, {
                name: req.body.name,
                iconName: req.body.iconName
            })
        if (!doc.matchedCount) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найдена категория'
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
            message: 'Не удалось обновить категорию'
        })
    }
}


export async function removeCategories(req, res) {
    try {
        const doc = await CategoriesModel.findOne({
            _id: req.params.id.toString(),
            user: req.userId
        })
        if (!doc) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найдена категория'
                })
        }

        const taskActive = await TaskActiveModel.deleteMany({
            categories: req.params.id.toString()
        })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: 'Не удалось удалить задачи в категории'
                })
            })

        const taskFulfilled = await TaskFulfilledModel.deleteMany({
            categories: req.params.id.toString()
        })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: 'Не удалось удалить задачи в категории'
                })
            })

        const category = await CategoriesModel.findByIdAndDelete({
            _id: req.params.id.toString()
        })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: 'Не удалось удалить категорию'
                })
            })
        res
            .status(200)
            .json({
                status: 'Успешно'
            })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось удалить категорию'
        })
    }
}