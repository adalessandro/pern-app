import React from 'react';
import { Layout } from 'antd';
import Login from '../user/Login'
import styles from  './Layout.module.css'

const App: React.FC = () => {
    return (
        <Layout className={styles.layout} >
            <Login />
        </Layout>
    );
};

export default App;