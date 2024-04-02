import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {secretTokenKey} from "../pass.js";
import {createStatistics} from "./StatisticsController.js";
import TaskActiveModule from "../models/TaskActive.js";

export async function register(req, res) {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
            theme: req.body.theme
        })

        const user = await doc.save()

        const token = jwt.sign({
            _id: user._id
        }, `${secretTokenKey}`, {
            expiresIn: '30d',
        })
        const {passwordHash, ...userData} = user._doc

        const statistics = await createStatistics(req.body.weekData, user._id)
        res
            .status(200)
            .json({
                ...userData,
                token,
                statistics
            })
    } catch (err) {
        console.log(err)
        res
            .status(500)
            .json({
                message: 'Не удалось зарегистрироваться',
            })
    }
}

export async function login(req, res) {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res
                .status(400)
                .json({
                    message: 'Не верный логин или пароль'
                })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res
                .status(400)
                .json({
                    message: 'Не верный логин или пароль'
                })
        }

        const token = jwt.sign({
            _id: user._id
        }, `${secretTokenKey}`, {
            expiresIn: '30d',
        })

        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res
            .status(400)
            .json({
                message: 'Не удалось авторизоваться',
            })
    }
}

export async function getMe(req, res) {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        const {passwordHash, ...userData} = user._doc
        res.json({
            ...userData,
            token: req.token
        })
    } catch (err) {
        console.log(err)
        res
            .status(400)
            .json({
                message: 'Нет доступа',
            })
    }
}

export async function changeName(req, res) {
    try {
        const doc = await UserModel.updateOne(
            {
                _id: req.userId
            }, {
                fullName: req.body.fullName
            })

        if (!doc.matchedCount) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найден пользователь'
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
            message: 'Не удалось обновить имя'
        })
    }
}

export async function changeEmail(req, res) {
    try {
        const doc = await UserModel.updateOne(
            {
                _id: req.userId
            }, {
                email: req.body.email
            })


        if (!doc.matchedCount) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найден пользователь'
                })
        }

        res
            .status(200)
            .json({
                update: true
            })
    } catch (err) {
        console.log(err)
        if (err.code === 11000) {
            res.status(400).json({
                message: 'Такой email уже существует'
            })
        } else {
            res.status(500).json({
                message: 'Не удалось обновить email'
            })
        }
    }
}

export async function changePassword(req, res) {
    try {
        const user = await UserModel.findOne({email: req.body.email})
        if (!user) {
            return res
                .status(400)
                .json({
                    message: 'Не удалось обновить пароль | email'
                })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res
                .status(400)
                .json({
                    message: 'Не верный пароль'
                })
        }

        const password = req.body.newPass
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = await UserModel.updateOne(
            {
                _id: req.userId
            }, {
                passwordHash: hash
            })

        res
            .status(200)
            .json({
                update: isValidPass
            })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось обновить пароль'
        })
    }
}

export async function changePhoto(req, res) {
    try {
        const doc = await UserModel.updateOne(
            {
                _id: req.userId
            }, {
                avatarUrl: req.body.avatarUrl
            })

        if (!doc.matchedCount) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найден пользователь'
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
            message: 'Не удалось изменить тему'
        })
    }
}

export async function changeTheme(req, res) {
    try {
        const doc = await UserModel.updateOne(
            {
                _id: req.userId
            }, {
                theme: req.body.theme
            })

        if (!doc.matchedCount) {
            return res
                .status(404)
                .json({
                    message: 'Нет доступа или не найден пользователь'
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
            message: 'Не удалось обновить фото'
        })
    }
}