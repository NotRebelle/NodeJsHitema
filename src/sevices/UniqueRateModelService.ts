import {Model} from "../entity/Model";

export const verifUniqueRateModelService = async (id_modal: string, id_manager: string): Promise<boolean> => {
    return Model.findById(id_modal).then((model) => {
        let unique = true;

        if (model === null) {
            return false;
        }

        model.rating.forEach((rate) => {
            if (id_manager === rate.id_manager) {
                unique = false;
            }
        });

        return unique;
    });
};
