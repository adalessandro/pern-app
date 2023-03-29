import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import {
    Request,
    Response,
    NextFunction
} from 'express';

import { userRoles } from '../types/models';
import connection from '../services/db';

const userRepository = connection.getRepository(User)

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (token === undefined) {
        return res.status(401).json({
            message: "Unauthorized!"
        });
    }
    const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
    token = token.replace('Bearer ', '');
    jwt.verify(token as string, secret, async (err, decoded: any) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }

        try {
            const user = await userRepository.findByPk(decoded!.id);
            if (user === null) {
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }


            req.user = {
                id: user.id,
                role: user.role
            }

            next();


        } catch (error) {
            next(error)
        }


    });
};

export const hasWriteRole = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === userRoles.Read) {
        res.status(403).send({
            message: "Require Write Role!"
        });
        return;
    }
    next();
};

export const isRoot = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== userRoles.Root) {
        res.status(403).send({
            message: "Require Root Role!"
        });
        return;
    }
    next();
};
