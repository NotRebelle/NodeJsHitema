import { Router } from 'express'
import { User, userSerialized } from '../entity/User'
import { hashPassword } from "../sevices/PasswordHasherService";
import registerDTO, { registerSchema } from "../dto/register";
import { verifUniqueUser } from "../sevices/UniqueUserService";

const router = Router()

router.post('/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body)
    if (error != null) {
        return res.status(400).json({ error: error.message })
    }

    let registerDTO = req.body as registerDTO

    if (typeof(registerDTO.password) != "string") {
        return res.status(400).json({ error: "bad request body" })
    }

    if (!await verifUniqueUser(registerDTO.name, registerDTO.email)) {
        return res.status(400).json({ error: "name or email already used" })
    }

    registerDTO.password = hashPassword(registerDTO.password);
    registerDTO.role = "artist";
    registerDTO.created_at = new Date();
    registerDTO.updated_at = new Date();
    registerDTO.banned = false;

    let user = await User.create(registerDTO);

    res.status(200).json({ user: userSerialized(user.toObject()) })
})

export default router
