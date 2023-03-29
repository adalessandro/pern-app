import { Button, Col, Divider, Form, Input, InputNumber, PageHeader, Row, TimePicker, Space, Select } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import React from 'react';
import moment from 'moment'
import { useAddUserMutation, useUpdateUserMutation } from '../../app/services/users';
import { User } from '@backend/models'
import { userRoles } from '../../utils/types';
import { FormInstance } from 'rc-field-form';
const { Option } = Select;


const App: React.FC<{ back: () => void; entity?: User; }> = ({ back, entity }) => {
    const [addUser, { isLoading: isLA, isSuccess: isSA, error: errorA }] = useAddUserMutation()
    const [updateUser, { isLoading: isLU, isSuccess: isSU, error: errorU }] = useUpdateUserMutation()
    const [form] = Form.useForm();


    let save = addUser;
    let loading = isLA;
    let success = isSA;
    let error = errorA;
    if (entity && entity?.id > 0) {
        save = updateUser;
        loading = isLU;
        success = isSU;
        error = errorU;

    }

    if (error && 'status' in error && error.status === 400) {
        form.setFields(error.data as any);
    }

    const onFinish = async (values: any, form: FormInstance<any>) => {
        const paylod = {
            ...values,
            id: entity?.id
        }
        //console.log('Success:', paylod);

        try {
            const payload = await save(paylod).unwrap();
            //console.log('fulfilled', payload)
            back()
        } catch (error) {
            //handle error different to 404
        }
    };

    const onFinishFailed = (errorInfo: any) => {

        //console.log('Failed:', errorInfo);
    };

    const setInitialValues = (entity: User) => ({
        ...entity,
    })


    return (
        <PageHeader
            ghost={false}
            onBack={back}
            title='User'
            subTitle={entity ? 'edit' : 'new'}
        >

            <Form
                name="user"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 8 }}
                initialValues={entity ? setInitialValues(entity) : {}}
                onFinish={(data) => onFinish(data, form)}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Required field!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Fullname"
                    name="fullname"
                    rules={[{ required: true, message: 'Required field!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Required field!', type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item name="role" label="Role" rules={[{ required: true, message: 'Required field!' }]}>
                    <Select
                        placeholder="Select a role"
                    >
                        <Option key={userRoles.Read} value={userRoles.Read}>{userRoles[userRoles.Read]} </Option>)
                        <Option key={userRoles.Write} value={userRoles.Write}>{userRoles[userRoles.Write]} </Option>)
                        <Option key={userRoles.Root} value={userRoles.Root}>{userRoles[userRoles.Root]} </Option>)
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    extra={entity !== undefined && <>Let it blank if you do not want to update</>}
                    rules={entity !== undefined ?
                        [
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value && value.length < 7) {
                                        return Promise.reject(new Error('min lenght 7!'));
                                    }
                                    return Promise.resolve();

                                },
                            }),
                        ] :
                        [
                            { required: true, message: 'Required field (min lenght 7)!', min: 7 }
                        ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    extra={entity !== undefined && <>Let it blank if you do not want to update</>}
                    hasFeedback
                    rules={[
                        {
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const password = getFieldValue('password');
                                if ((!value && !password) || password === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Row>
                    <Col >
                        <Button type="default" onClick={back} disabled={loading} >
                            Cancel
                        </Button>

                    </Col>
                    <Col span={4} offset={5} >
                        <Button

                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                            icon={<CloudUploadOutlined />}
                            loading={loading}
                        >
                            <Divider type="vertical" />
                            {/*isSubmitting ? "One moment ..." : "Save"*/}
                            Submit
                        </Button>
                    </Col>
                </Row>
            </Form>

        </PageHeader>

    );
};

export default App;