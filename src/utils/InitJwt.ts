import * as crypto from "crypto";
import * as fs from 'fs'

export interface Secret {
    secret: string
}

const generateSecret = (rounds: number = 12): Secret => {
    return {
        secret: crypto.randomBytes(64).toString('hex')
    }
}

export const InitJwt = (): void => {
    const secret: Secret = generateSecret()
    fs.writeFile('./jwt_secret.txt', secret.secret, (err) => {
        if (err) {
            throw err
        }
    })
}
