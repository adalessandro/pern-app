import React, { useState } from 'react';
import { Space, Table, Checkbox, Button, PageHeader, Popconfirm, Input } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { User } from '@backend/models';
import { errorAPI } from '@backend/utils';
import moment from "moment";
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import qs from 'qs';
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { showSuccess, showWarning } from '../../utils/helpers'
import { useGetUsersQuery, useDeleteUserMutation } from '../../app/services/users';
import { userRoles } from '../../utils/types';

const { Search } = Input;

const columns = (edit: (e: User) => void): ColumnsType<User> => {
    return ([
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render(value, entity) {
                if (entity.active) {
                    return (<a onClick={() => { edit(entity); }}>{value}</a>);
                }
                return (<>{value}</>);
            },
        },
        {
            title: 'Fullname',
            dataIndex: 'fullname',
            key: 'fullname',
            sorter: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            filterMultiple: true,
            filters: [
                { text: userRoles.Read, value: userRoles.Read }, 
                { text: userRoles.Write, value: userRoles.Write }, 
                { text: userRoles.Root, value: userRoles.Root }, 
            ],
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt) => {
                return (moment(createdAt).format("YYYY-MM-DD HH:mm"))
            }
        },
        {
            title: 'Active',
            dataIndex: 'active',
            key: 'active',
            filterMultiple: false,
            filters: [{ text: 'Active', value: true }, { text: 'Inactive', value: false }],
            render: (active) => <Checkbox checked={active} />
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => <Action record={record} />
        },

    ]);
}


const Action: React.FC<{ record: User }> = ({ record }) => {
    const [deleteUser, { isLoading, isError, data }] = useDeleteUserMutation();

    const remove = async (id: number) => {
        try {
            const payload = await deleteUser(id).unwrap()
            showSuccess('User deleted');
        } catch (error:  any) {
            if (error && 'data' in error) {
                const deleteError: errorAPI = error as errorAPI;
                if (deleteError.status === 409) {
                    showWarning(deleteError.data.message);
                }
            }
        }
    }

    if (record.active && record.role !== userRoles.Root) {


        return (<Space size="middle">
            <Popconfirm
                title="Are you sure you want to delete this user?"
                onConfirm={() => remove(record.id)}
                okText="Yes"
                cancelText="No"
                disabled={isLoading}
            >
                <Button
                    icon={<DeleteOutlined />}
                    type='default' danger
                    loading={isLoading}
                    disabled={isLoading}
                >
                    Delete
                </Button>
            </Popconfirm>
        </Space>)
    }
    return (<></>)


}


interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Record<string, FilterValue | null>;
}

const UserTable: React.FC<{ edit: (e: User) => void, create: () => void }> = ({ edit, create }) => {
    const [nameFilter, setNameFilter] = useState('')
    const [tableParams, setTableParams] = useState<TableParams>({
        pagination: {
            current: 1,
            pageSize: 10
        },
    });


    const { data, isFetching, isSuccess, refetch } = useGetUsersQuery(qs.stringify({ ...tableParams, textFilters: { fullname: `%${nameFilter}%` } }));


    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<User>
    ) => {
        setTableParams({
            pagination,
            filters,
            sortField: sorter.field?.toString(),
            sortOrder: sorter.order?.toString(),
        });
    };

    const onSearch = (value: string) => {
        setNameFilter(value);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            current: 1
          }
        });
      }

    return (
        <PageHeader
            ghost={false}
            onBack={undefined}
            title='Users'
            subTitle='list'
            extra={[
                <Space key='search' size="small">    <Search key='fullname' placeholder="Search by fullname" onSearch={onSearch} style={{ width: 200 }} /></Space>,
                <Button key='refresh' icon={<ReloadOutlined />} onClick={refetch}>
                    Refresh
                </Button>,
                <Button type='primary' key='new' icon={<PlusOutlined />} onClick={create}>
                    New
                </Button>]}
        >
            <Table
                loading={isFetching}
                columns={columns(edit)}
                dataSource={data?.rows}
                rowKey={(e: User) => e.id}
                pagination={{ ...tableParams.pagination, total: data?.count }}
                onChange={handleTableChange as any}

            />
        </PageHeader>
    );
}

export default UserTable;