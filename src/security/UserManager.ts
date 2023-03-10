import jwt_decode from "jwt-decode";

export const getIdUser = (req: any): string|null => {
    const token: string = req.header('Authorization').split(' ')[1] ?? null;

    if (token == null) {
        return null;
    }

    const decodedToken: any = jwt_decode(token);

    return decodedToken.sub._id ?? null;
}

const getRole = (req: any): string => {
    const token: string = req.header('Authorization').split(' ')[1] ?? null;

    if (token == null) {
        return 'none';
    }

    const decodedToken: any = jwt_decode(token);

    return decodedToken.sub.role ?? 'none';
};

export const isAdmin = (req: any, res: any): boolean => {
    const role = getRole(req);

    if (role !== 'admin') {
        return false
    }

    return true;
}

export const isManager = (req: any, res: any) => {
    const role = getRole(req);

    if (role !== 'manager') {
        return false
    }

    return true;
}

export const isArtist = (req: any, res: any) => {
    const role = getRole(req);

    if (role !== 'artist') {
        return false
    }

    return true;
}
