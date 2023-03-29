import { Job, withPagination } from '@backend/models';
import { retry } from '@reduxjs/toolkit/query/react';
import { Header } from 'antd/lib/layout/layout';
import { api } from './api';


export const jobsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getJobs: build.query<withPagination<Job>, string>({
            query: (queryParams) => ({ url: `job?${queryParams}` }),
            providesTags: (_jobs, _err) => [
                ...(_jobs || { rows: [] }).rows.map(({ id }) => ({ type: 'Jobs', id } as const)),
                { type: 'Jobs', id: 'LIST' },
            ],
        }),
        getJob: build.query<Job, number>({
            query: (id) => `job/${id}`,
            providesTags: (_post, _err, id) => [{ type: 'Jobs', id } as const],
        }),
        addJob: build.mutation<Job, any>({
            query: (body) => ({
                url: `job`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Jobs', id: 'LIST' }],
        }),
        updateJob: build.mutation<Job, any>({
            query: (body) => ({
                url: `job/${body.get('id')}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'Jobs', id: 'LIST' }],
        }),
        deleteJob: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `job/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Jobs', id }],
        }),
    }),
})

export const {
    useGetJobQuery,
    useGetJobsQuery,
    useAddJobMutation,
    useUpdateJobMutation,
    useDeleteJobMutation,
} = jobsApi

