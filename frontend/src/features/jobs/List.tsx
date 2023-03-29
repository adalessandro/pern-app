import React, { useState } from 'react';
import { Button, Divider, Input, PageHeader, Popconfirm, Select, Space, Table, Tag, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { Job, User } from '@backend/models';
import Moment from "moment";

import {  useDeleteJobMutation, useGetJobsQuery  } from '../../app/services/jobs';

import { DeleteOutlined, PlusOutlined, ReloadOutlined, DoubleRightOutlined, CloseOutlined, RetweetOutlined } from '@ant-design/icons'
import qs from 'qs';
import { downloadFile, showError, showSuccess, showWarning, useHasPermissions } from '../../utils/helpers';
import { errorAPI } from '@backend/utils';
import { jobPriorities, jobStatus } from '../../utils/types';
import { getHttpClient } from '../../utils/httpClient';
import { selectUser } from '../user/userSlice';
import { useAppSelector } from '../../app/hooks';
import { usePermissions } from '../../utils/helpers';
import { userRoles } from '../../utils/types';
import { useGetUsersQuery } from '../../app/services/users';

const { Search } = Input;


const objectsEqual = (o1: any, o2: any): boolean => {
  if (o1 !== null && o2 !== null && typeof o1 === 'object' && Object.keys(o1).length > 0) {
    return Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
  } else {
    return o1 === o2
  }

}

const finalStatus: string[] = [jobStatus.Translated, jobStatus.Deployed]


const columns = (edit: (entity: Job) => void, users: User[] | undefined): ColumnsType<Job> => {

  return [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render(value, entity) {
        return (<Button type='text'> {value}</Button>);
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdById',
      key: 'createdById',
      render: (createdById, record) => {
        return (<span>{users?.find(e => e.id === createdById)?.fullname}</span>)
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      defaultSortOrder: 'descend',
      render: (createdAt) => {
        if (createdAt) {
          return (Moment(createdAt).format("YYYY-MM-DD HH:mm"))
        }
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => <p>pocholo</p>
    },
  ];
}



interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

const MyTable: React.FC<{ edit: (e: Job) => void, create: () => void }> = ({ edit, create }) => {
  const [nameFilter, setNameFilter] = useState('')

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortField: 'createdAt',
    sortOrder: 'descend',
  });

  const user = useAppSelector(selectUser);


  const { data: jobs, isSuccess: isSuccessJobs, isError, isFetching: isFetchingJobs, isLoading, error, refetch } =
    useGetJobsQuery(qs.stringify({ ...tableParams, textFilters: { name: `%${nameFilter}%` } }));
  const { data: users, isFetching: isFetchingUsers } = useGetUsersQuery('');


  const isFetching = isFetchingJobs;


  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
  ) => {
    let newParams = {
      filters,
      pagination
    }

    if (tableParams.filters && !objectsEqual(tableParams.filters, filters)) {
      newParams = {
        ...newParams,
        pagination: {
          ...pagination,
          current: 1
        }
      }
    }

    setTableParams(newParams);
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
      title='Jobs'
      subTitle='list'
      extra={[
        <Space key='search' size="small">    <Search key='jobSearch' placeholder="Search by job name" onSearch={onSearch} style={{ width: 200 }} /></Space>,
        <Button key='refresh' icon={<ReloadOutlined />} onClick={refetch}>
          Refresh
        </Button>,
        usePermissions(<Button type='primary' key='new' icon={<PlusOutlined />} onClick={create}>
          New
        </Button>, userRoles.Write)]}
    >
      <Table
        loading={isFetching}
        columns={columns(edit, users?.rows)}
        dataSource={jobs?.rows}
        rowKey={(e: Job) => e.id}
        pagination={{ ...tableParams.pagination, total: jobs?.count, showSizeChanger: true }}
        onChange={handleTableChange as any}

      />
    </PageHeader>
  );
}

export default MyTable;

