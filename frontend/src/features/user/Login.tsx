import React from 'react';
import { Button, Form, Input, Row } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { login, selectUser } from './userSlice'

import styles from './Login.module.css'
import { CNT_VERSION } from '../../utils/helpers';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = user.status === 'loading';

  const onFinish = (values: any) => {
    try {
      dispatch(login(values))
    } catch (error) {
      console.log(error);
    }
  };

  return (

    <Form
      name="normal_login"
      className={styles.form}
      initialValues={{ username: '', password: '' }}
      onFinish={onFinish}
    >
      <h2 className={styles.app_name}>APP{' '}
        <small>
          {CNT_VERSION}
        </small>
      </h2>

      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
          className={styles.input}
        />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} disabled={isLoading} type="primary" htmlType="submit" className={styles.button}>
          Log in
        </Button>
      </Form.Item>
      {user.message && <Row justify='center' style={{ color: 'red' }} >{user.message}</Row>}
    </Form>
  );
};

export default App;