import { config } from 'dotenv';
import express, {
    Application,
    NextFunction,
    Request,
    Response,
} from 'express';

import cors from 'cors';

// check this
import { Server } from 'http';

config();

import connection from "./services/db";
import { SyncOptions } from 'sequelize'

import jobRoutes from './routes/job.routes'
import userRoutes from './routes/user.routes'

import { userRoles } from './types/models';
import bcrypt from 'bcryptjs';
import { User } from './models/user';

import { verifyToken } from './middlewares/auth.middleware';

const userRepository = connection.getRepository(User)

const app: Application = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors())

/* by default all routes required token */
app.all('*', checkUser);

/* public routes */
function checkUser(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/api/user/login') return next();
    if (req.path === '/api') return next();
    verifyToken(req, res, next);
}

app.use('/api/job', jobRoutes)
app.use('/api/user', userRoutes)

app.get('/api', async (req: Request, res: Response) => {

    try {
        const test = { ariel: `Hello Word! ${(new Date).toTimeString()}` }
        res.status(200).json(test);
    } catch (error) {
        console.error(error)
    }
});


const PORT = process.env.PORT || 3001;
let server: Server;

const start = async (): Promise<void> => {
    try {
        /*
        esto te va a crear la bbdd la primera vez- chupapito
        */

        await connection.sync({
            force: process.env.NODE_ENV !== 'production'
        } as SyncOptions);

        insertUser('ariel', 'chupapito', 'ariel@chupapito.com', 'Ariel Chupapito');

        server = app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

export interface ResponseError extends Error {
    statusCode?: number;
}

app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    console.error(JSON.stringify(err));
    if (err instanceof Error) {
        console.log(err.message);
    } else {
        console.log('!err instanceof Error:', err);
    }
    next(err);
});

app.use((err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    let message = err.message;
    if (process.env.NODE_ENV === 'production' && statusCode >= 500) {
        message = "Server Error";
    }
    res.status(statusCode).json({ 'message': message });

    return;
});

void start();



// Handling Error
process.on("unhandledRejection", (err: any) => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})

async function insertUser(username: string, password: string, email: string, fullname: string): Promise<boolean> {

    try {
        const user = await userRepository.findOne({ where: { username: username } })
        if (user === null) {
            await userRepository.create({
                username,
                email,
                fullname,
                active: true,
                password: bcrypt.hashSync(password, 8),
                role: userRoles.Root
            })
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}