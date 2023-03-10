import Joi from 'joi'
import {Password} from "../sevices/PasswordHasherService";

export const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
})

export default interface registerDTO {
    email: string
    password: string|Password,
    name: string,
    role: string,
    created_at: Date,
    updated_at: Date,
    banned: boolean
}
