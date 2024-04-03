import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import {
    changeEmail,
    changeName,
    changePassword,
    changePhoto, changeTheme,
    getMe,
    login,
    register
} from "./controllers/UserController.js";
import handleValidationErrors from "./Utils/handleValidationErrors.js";
import {loginValidation, registerValidation} from "./validations/auth.js";
import checkAuth from "./Utils/checkAuth.js";
import {
    createCategories,
    getCategories,
    removeCategories,
    updateCategories
} from "./controllers/CategoriesController.js";
import {
    getAllTask,
    taskCreate,
    taskDeleted,
    taskFulfilled,
    updateTask
} from "./controllers/TaskController.js";
import {checkStatistics} from "./controllers/StatisticsController.js";
import multer from "multer";

const pass = encodeURIComponent(process.env.PASSWORD)
export const secretTokenKey = process.env.TOKEN



mongoose.connect(`mongodb+srv://Sintel:${pass}@cluster0.skbrnni.mongodb.net/todo?retryWrites=true&w=majority`)
    .then(() => console.log('Connect to MongoDB'))
    .catch((err) => console.log("Error connect to MongoDB", err))

// Вместо todo можно вставить любое имя, так будет назваться БД

export const app = express()
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage})
app.get('/', (req, res) => {
    return res
        .status(400)
        .json({
            message: 'rwerwerwerwerwer'
        })
})

app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.get('/auth/me', checkAuth, getMe)

app.patch('/user/name', checkAuth, changeName)
app.patch('/user/email', checkAuth, changeEmail)
app.patch('/user/pass', checkAuth, changePassword)
app.patch('/user/photo', checkAuth, changePhoto)
app.patch('/user/theme', checkAuth, changeTheme)

app.get('/categories', checkAuth, getCategories)
app.post('/categories', checkAuth, createCategories)
app.patch('/categories', checkAuth, updateCategories)
app.delete('/categories/:id', checkAuth, removeCategories)


app.get('/categories/task/:id', checkAuth, getAllTask)
app.post('/categories/task', checkAuth, taskCreate)
app.patch('/categories/task', checkAuth, updateTask)
app.delete('/categories/task/:id/:weekData', checkAuth, taskDeleted)

app.patch('/categories/taskFulfilled', checkAuth, taskFulfilled)

app.patch('/statistics', checkAuth, checkStatistics)

app.get('/upload', checkAuth, (req, res) => {

})
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: req.file.originalname
    })
})


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    } else console.log('Server ok')
})