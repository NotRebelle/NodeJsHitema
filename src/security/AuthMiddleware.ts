import { expressjwt } from 'express-jwt'
import * as fs from 'fs';


export const jwt = () => {
    const secret = fs.readFileSync('jwt_secret.txt','utf8');
    if (!secret) {
        throw new Error('JWT secret is not defined')
    }

    return expressjwt({ secret, algorithms: ['HS256'] }).unless({
        path: [
            '/',
            '/auth/login',
            '/auth/register'
        ]
    })
}
