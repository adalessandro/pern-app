import { Op, col } from "sequelize";

export interface ListQueryParams {
    pagination?: {
        pageSize: number;
        current: number
    };
    sortField?: string;
    sortOrder?: string;
    filters?: {
        [key: string]: any
    },
    textFilters?: {
        [key: string]: string
    }
}

export function extractSafely(params: ListQueryParams, defaultOrder: boolean = false) {
    let limit = undefined;
    let offset = undefined;
    let order = [['id', defaultOrder ? 'DESC' : 'ASC']];
    let filters = params.filters ?? {};
    
    if (params.textFilters) {
        Object.keys(params.textFilters).forEach(key => {
            filters = {
                ...filters,
                [key]: {
                    [Op.iLike]: params.textFilters ? params.textFilters[key] : null
                }
            }
        })
    }

    if (params.pagination !== undefined) {
        limit = parseInt(params.pagination.pageSize.toString());
        offset = (params.pagination.current - 1) * params.pagination.pageSize;
    }

    if (params.sortField !== undefined) {
        const sortOrder = params.sortOrder === 'ascend' ? 'ASC' : 'DESC';
        order = [[params.sortField, sortOrder]]
    }



    Object.entries(filters).forEach(([key, value]) => {
        if (value === '') {
            delete filters[key];
        }
    })


    return (
        {
            limit: limit,
            offset: offset,
            order: order,
            filters: filters
        }
    )
}