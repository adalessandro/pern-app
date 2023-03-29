import {
    Request,
    Response,
    NextFunction
} from 'express';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import connection from '../services/db';
import { extractSafely, ListQueryParams } from '../utils/helpers';
import { withPagination } from '../types/models';
import { ForeignKeyConstraintError, Op, Order } from 'sequelize';
import { StatusCodes } from 'http-status-codes';

const userRepository = connection.getRepository(User)

const blankPass = (e: User): User => {
    e.password = ''
    return e;
}


export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        let item: User | null = await User.findByPk(req.params.id);
        item = item !== null ? blankPass(item) : null;
        res.json(item);
    } catch (error) {
        next(error);
    }
}

export async function find(req: Request<unknown, unknown, unknown, ListQueryParams>, res: Response, next: NextFunction) {
    try {
        const { limit, offset, order, filters } = extractSafely(req.query);
        const items: withPagination<User> = await userRepository.findAndCountAll({
            limit: limit,
            offset: offset,
            order: order as Order,
            where: filters,
        });
        items.rows = items.rows.map(e => blankPass(e));
        res.json(items);

    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {

        const payload = {
            username: req.body.username.trim(),
            fullname: req.body.fullname,
            password: bcrypt.hashSync(req.body.password, 8),
            email: req.body.email,
            role: req.body.role,
            active: true
        }


        const itemResponse: User = await userRepository.create(payload);

        return res.status(201).json(itemResponse);
    } catch (error) {
        next(error);
    }

}

export async function update(req: Request, res: Response, next: NextFunction) {
    try {

        let item: User | null = await userRepository.findByPk(req.params.id);

        if (item === null) {
            return res.status(404);
        }

        const unique = await userRepository.count({
            where: { username: req.body.username.trim(), id: { [Op.ne]: req.params.id } },
        });

        if (unique > 0) {
            return res.status(404).json([{
                name: 'username',
                errors: ['username is not unique'],
            }]);
        }

        item.username = req.body.username.trim();
        item.fullname = req.body.fullname;
        item.email = req.body.email;
        item.role = req.body.role;

        if (req.body.password) {
            item.password = bcrypt.hashSync(req.body.password, 8);
        }

        await item.save();

        return res.status(200).json(blankPass(item));

    } catch (error) {
        next(error);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        /* TODO validations */
        const result = await userRepository.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(StatusCodes.NO_CONTENT).send()


    } catch (error) {
        if (error instanceof ForeignKeyConstraintError) {
            const result = await userRepository.update({ active: false }, {
                where: {
                    id: req.params.id
                }
            });
            return res.status(StatusCodes.CONFLICT).json({ message: 'The entity was set to inactive because has related data.' })
        }
        next(error);
    }
}

//export async function login(req: Request, res: Response<{username:string, token:string, id:number, name:string}>, next: NextFunction) {
export async function login(req: Request, res: Response, next: NextFunction) {
    try {

        const user = await userRepository.findOne({
            where: {
                username: req.body.username
            }
        });

        if (user === null) {
            return res.status(401).json({ message: 'Bad credentials' });
        }


        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Bad credentials' });
        }

        // TODO move
        const secret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';

        const token = jwt.sign({ id: user.id }, secret, {
            // 24 hours
            expiresIn: 86400
            //expiresIn: 600
        });

        res.status(200).json({
            accessToken: token,
            id: user.id,
            username: user.username,
            role: user.role,
            fullname: user.fullname,
            //expiresIn: 600
            expiresIn: 86400
        });

    } catch (error) {
        next(error);
    }
}


export async function updatePassword(req: Request, res: Response, next: NextFunction) {
    try {

        let item: User | null = await userRepository.findByPk(req.params.id);
        if (item === null) {
            return res.status(404);
        }

        const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            item.password
        );

        if (!passwordIsValid) {
            return res.status(400).json([{
                name: 'password',
                errors: ['Wrong password'],
            }]);
        }

        item.password = bcrypt.hashSync(req.body.newPassword, 8),

            await item.save();

        return res.status(200).json(blankPass(item));

    } catch (error) {
        next(error);
    }
}
