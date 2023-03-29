import {
    Request,
    Response,
    NextFunction
} from 'express';
import { Job } from '../models/job';
import connection, { jobRepository } from '../services/db';

import { extractSafely, ListQueryParams } from '../utils/helpers';
import {  Order } from 'sequelize';
import { withPagination } from '../types/models';
import { StatusCodes } from 'http-status-codes';



export async function get(req: Request, res: Response, next: NextFunction) {
    try {
        const job: Job | null = await Job.findByPk(req.params.id);
        res.json(job);
    } catch (error) {
        next(error);
    }
}

export async function find(req: Request<unknown, unknown, unknown, ListQueryParams>, res: Response, next: NextFunction) {
    try {
        const { limit, offset, order, filters } = extractSafely(req.query);

        const jobs: withPagination<Job> = await jobRepository.findAndCountAll({
            limit: limit,
            offset: offset,
            order: order as Order,
            distinct: true,
            where: filters,

        });

        res.json(jobs);
    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        /* validations */

        const job = {
            name: req.body.name,
            createdById: req.user.id,
        }


        const jobResponse: Job = await jobRepository.create(job);

        return res.status(201).json(jobResponse);

    } catch (error) {
        next(error);
    }

}
export async function update(req: Request, res: Response, next: NextFunction) {
    /* validations */
    const t = await connection.transaction();

    try {
        let item: Job | null = await jobRepository.findByPk(req.params.id);

        if (item === null) {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }

        item.name = req.body.name;
        item.save();

        await t.commit()

        return res.status(200).json(item);

    } catch (error) {
        await t.rollback()
        next(error);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        /* validations */
        let item: Job | null = await jobRepository.findByPk(req.params.id);

        if (item === null) {
            return res.status(404);
        }

        await item.destroy()

        res.status(StatusCodes.NO_CONTENT).json()


    } catch (error) {
        next(error);
    }
}

