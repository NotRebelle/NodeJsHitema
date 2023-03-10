import { Router } from 'express'
import {UpdateBannedUserSchema, User, userSerialized} from '../entity/User'
import { isAdmin } from "../security/UserManager";
import { Model } from "../entity/Model";
import registerDTO, { registerSchema } from "../dto/register";
import {verifUniqueUser} from "../sevices/UniqueUserService";
import {hashPassword} from "../sevices/PasswordHasherService";

const router = Router()

router.get('/users', async (req, res) => {
    if (!isAdmin(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const users = await User.find()
    return res.status(200).json(users)
});

router.get('/users/:id', async (req, res) => {
    if (!isAdmin(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await User.findById(req.params.id)
    if (user == null) {
        return res.status(404).json({ error: 'User not found' })
    }

    return res.status(200).json(user)
})

router.put('/users/:id', async (req, res) => {
    if (!isAdmin(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { error } = UpdateBannedUserSchema.validate(req.body)
    if (error != null) {
        return res.status(400).json({ error: error.message })
    }

    const user = await User.findById(req.params.id)
    if (user == null) {
        return res.status(404).json({ error: 'User not found' })
    }

    await User.updateOne({ _id: req.params.id }, { $set: { banned: req.body.banned, updated_at: new Date() } });

    return res.status(200).json(await User.findById(req.params.id))
})

router.delete('/users/:id', async (req, res) => {
    if (!isAdmin(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const user = await User.findById(req.params.id)
    if (user == null) {
        return res.status(404).json({ error: 'User not found' })
    }

    await User.deleteOne({ _id: req.params.id })

    return res.status(200).json({ message: 'User deleted' })
})

router.get('/models', async (req, res) => {
    if (!isAdmin(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const models = await Model.find();
    return res.status(200).json(models);
});

router.post('/register_manager', async (req, res) => {
    if (!isAdmin(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

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
    registerDTO.role = "manager";
    registerDTO.created_at = new Date();
    registerDTO.updated_at = new Date();
    registerDTO.banned = false;

    let user = await User.create(registerDTO);

    res.status(200).json({ user: userSerialized(user.toObject()) })
})

export default router
