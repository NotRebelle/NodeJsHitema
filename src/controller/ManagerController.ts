import { Router } from 'express'
import {getIdUser, isArtist} from "../security/UserManager";
import { Model } from "../entity/Model";
import rateDTO, {rateSchema} from "../dto/rate";
import {verifUniqueRateModelService} from "../sevices/UniqueRateModelService";
import {User} from "../entity/User";

const router = Router()

router.get('/models', async (req, res) => {
    if (isArtist(req, res)) {
        return res.status(403).json({ error: 'Forbidden' })
    }

    const models = await Model.find({ valid: 0 })
    return res.status(200).json(models)
});

router.post('/rate/:id', async (req, res) => {
    if (isArtist(req, res)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    const { error } = rateSchema.validate(req.body)
    if (error != null) {
        return res.status(400).json({ error: error.message })
    }

    let rateDTO = req.body as rateDTO

    if (rateDTO.rate != -1 && rateDTO.rate != 1) {
        return res.status(400).json({ error: "rate out of range" })
    }

    if (rateDTO.comment == null || rateDTO.comment.length < 25) {
        return res.status(400).json({ error: "comment not complete enough" })
    }

    const model = await Model.findById(req.params.id);

    if (model == null) {
        return res.status(404).json({ error: "this model is not found" })
    }

    const id_manager = getIdUser(req);

    if (id_manager == null) {
        return res.status(500).json({ error: "Interal error" })
    }

    if(!await verifUniqueRateModelService(req.params.id, id_manager)){
        return res.status(400).json({ error: "you already given your rating" })
    }

    model.rating.push(
        {
            rate: rateDTO.rate,
            comment: rateDTO.comment,
            created_at: new Date(),
            id_manager: id_manager
        }
    )
    let msg = ""
    if(model.rating.length == await User.countDocuments({role: "manager"})){
        let totalRate = 0
        model.rating.forEach((rate) => {
            totalRate += rate.rate
        });

        // On considère que si les votes pour / contre sont égaux alors nous validons
        if(totalRate >= 0){
            model.valid = 1
            msg = " and model has been published"
        } else {
            model.valid = -1
            msg = " and model has not been published"
        }
    }

    let modelUpdated = await model.save();

    return res.status(200).json({ message: 'rating saved' + msg })
})

export default router
