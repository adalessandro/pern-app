import { Job as _Job } from '../models/job'
import { User as _User } from '../models/user'

export interface Job extends _Job { };

export interface User extends _User { };

export enum userRoles {
    Read = 'Read',
    Write = 'Write',
    Root = 'Root',
}

export type withPagination<T> = {
    count: number;
    rows: T[];
}

