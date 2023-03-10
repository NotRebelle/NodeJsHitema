import {type User, userSerialized} from '../entity/User'
import jwt from 'jsonwebtoken'
import * as fs from "fs";

export const generateToken = (user: typeof User) => {
    const secret = fs.readFileSync('jwt_secret.txt','utf8');
    if (!secret) {
        throw new Error('JWT secret is not defined')
    }

    const token = jwt.sign({ sub: userSerialized(user) }, secret, {
        expiresIn: '1h'
    })

    return {
        ...user,
        token
    }
}
