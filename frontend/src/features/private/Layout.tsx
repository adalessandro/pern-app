import React, { useState } from 'react';
import {
  UserOutlined,
  DownOutlined,
  TranslationOutlined,
  DeliveredProcedureOutlined,
  LogoutOutlined,
  EditOutlined,
  AreaChartOutlined
} from '@ant-design/icons';
import { Layout, Menu, MenuProps } from 'antd';
import { useAppDispatch, useAppSelector, useIsLoading } from '../../app/hooks';
import './Layout.css';
import Jobs from '../jobs/Jobs';
import User from '../user/User';
import ChangePassword from '../user/FormPassword';
import { logout, selectUser } from '../user/userSlice'
import { userRoles } from '../../utils/types';
import { BarLoader } from 'react-spinners'
import { CNT_VERSION } from '../../utils/helpers';
import ErrorBoundary from '../../utils/ErrorBoundary';

const { Header, Content, Sider } = Layout;


const Loading: React.FC = () => {
  const isLoading = useIsLoading();

  if (isLoading) {
    return (<BarLoader speedMultiplier={1} width="100%" height={5} color="#1890ff" />);
  }
  return null;
}


const App: React.FC = () => {
  const [menu, setMenuPrivate] = useState('jobs');
  const [backMenu, setBackMenu] = useState('');
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const isRoot = user.role === userRoles.Root;

  const setMenu = (newMenu: string) => {
    setBackMenu(menu);
    setMenuPrivate(newMenu);
  }

  const back = () => {
    setMenuPrivate(backMenu);
  }

  const sidebar: MenuProps['items'] = [
    {
      key: 'job',
      icon: React.createElement(DeliveredProcedureOutlined),
      label: `Jobs`,
    },
  ];

  if (isRoot) {
    sidebar.push(
      {
        key: 'user',
        icon: React.createElement(UserOutlined),
        label: `Users`,
      }
    )
  }


  const userMenu: MenuProps['items'] = [
    {
      key: 'user',
      label: <><UserOutlined /> {user.fullname ? user.fullname : user.username} <DownOutlined /> </>,
      children: [
        {
          key: 'edit',
          label: <><EditOutlined /> Change Password</>,
          onClick: () => { setMenu('changePassword') }
        },
        {
          key: 'logout',
          label: <><LogoutOutlined /> Log out</>,
          onClick: () => { dispatch(logout()) }
        }
      ]
    }];


  return (
    <Layout id='private-layout'>
      <Header className="header sticky">
        <span className='app-name'>APP <small>
          {CNT_VERSION}
        </small></span>
        <Menu theme="dark" style={{ float: 'right' }} disabledOverflow={true} mode="horizontal" selectedKeys={['key1']} items={userMenu} />
      </Header>
      <Layout id='private-layout-content'>
        <Sider width={200} id='left-menu' className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={[menu]}
            style={{ height: '100%', borderRight: 0, paddingTop: 24 }}
            items={sidebar}
            onClick={(e) => setMenu(e.key)}
          />
        </Sider>
        <Layout style={{ padding: '24px 24px' }}>
          {/*
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
        </Breadcrumb>
        */}
          <Loading />
          <Content
            className="site-layout-background"
            style={{
              padding: 14,
              marginTop: 0,
              minHeight: 280,
            }}
          >
            <ErrorBoundary>
              {menu === 'job' && <Jobs />}
              {menu === 'user' && <User />}
              {menu === 'changePassword' && <ChangePassword entity={user} back={back} />}
            </ErrorBoundary>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;