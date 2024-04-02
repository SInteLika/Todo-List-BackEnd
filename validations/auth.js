import {body} from "express-validator";

export const registerValidation = [
    body('fullName', 'Укажите имя(не менее 2-х букв)').isLength({ min : 2 }),
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 4 символа').isLength({ min : 4 }),
]

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 4 символа').isLength({ min : 4 }),
]