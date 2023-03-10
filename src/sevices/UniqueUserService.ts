import {User} from "../entity/User";

export const verifUniqueUser = async (name: string, email: string): Promise<boolean> => {
    return User.find().then((users) => {
        let unique = true;
        users.forEach((user) => {
            if (user.name === name || user.email === email) {
                unique = false;
            }
        });

        return unique;
    });
};
