import { User, withPagination } from '@backend/models';
import { retry } from '@reduxjs/toolkit/query/react';
import { Header } from 'antd/lib/layout/layout';
import { api } from './api';


export const jobsApi = api.injectEndpoints({
    endpoints: (build) => ({
        getUsers: build.query<withPagination<User>, string>({
            query: (queryParams) => ({ url: `user?${queryParams}` }),
            providesTags: (_jobs, _err) => [
                ...(_jobs || { rows: [] }).rows.map(({ id }) => ({ type: 'Users', id } as const)),
                { type: 'Users', id: 'LIST' },
            ],
        }),
        getUser: build.query<User, number>({
            query: (id) => `user/${id}`,
            providesTags: (_post, _err, id) => [{ type: 'Users', id } as const],
        }),
        addUser: build.mutation<User, any>({
            query: (body) => ({
                url: `user`,
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        updateUser: build.mutation<User, any>({
            query: (body) => ({
                url: `user/${body.id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [{ type: 'Users', id: 'LIST' }],
        }),
        updatePassword: build.mutation<User, any>({
            query: (body) => ({
                url: `user/${body.id}`,
                method: 'PATCH',
                body,
            }),
        }),
        deleteUser: build.mutation<{ success: boolean; id: number }, number>({
            query(id) {
                return {
                    url: `user/${id}`,
                    method: 'DELETE',
                }
            },
            invalidatesTags: (result, error, id) => [{ type: 'Users', id }],
        }),

    }),
})

export const {
    useGetUserQuery,
    useGetUsersQuery,
    useAddUserMutation,
    useUpdateUserMutation,
    useUpdatePasswordMutation,
    useDeleteUserMutation,
} = jobsApi

