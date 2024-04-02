import jwt from "jsonwebtoken"
import {secretTokenKey} from "../pass.js";

export default function checkAuth(req, res, next) {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
    if(token){
        try {
            const decoded = jwt.verify(token, `${secretTokenKey}`)
            req.userId = decoded._id
            req.token = token
            next()
        } catch (err){
            return res.status(403).json({
                message: 'Нет доступа'
            })
        }
    } else {
        return res.status(403).json({
            message: 'Нет доступа'
        })
    }
}