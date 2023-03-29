import { Button, Col, Divider, Form, Input, InputNumber, PageHeader, Row, TimePicker, Space, Select } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import React from 'react';
import { useUpdatePasswordMutation } from '../../app/services/users';
import { User } from '@backend/models'
import { FormInstance } from 'rc-field-form';
import { showSuccess } from '../../utils/helpers';
const { Option } = Select;


const App: React.FC<{ back: () => void; entity: Partial<User>; }> = ({ back, entity }) => {
    const [updatePassword, { isLoading, isSuccess, error }] = useUpdatePasswordMutation()
    const [form] = Form.useForm();

    if (error && 'status' in error && error.status === 400) {
        form.setFields(error.data as any);
    }

    const onFinish = async (values: any, form: FormInstance<any>) => {
        const paylod = {
            ...values,
            id: entity.id
        }

        try {
            const payload = await updatePassword(paylod).unwrap();
            showSuccess('Successful operation')
            back()
        } catch (error) {
            //handle error different from 400
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        //console.log('Failed:', errorInfo);
    };

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
                onFinish={(data) => onFinish(data, form)}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={form}
            >
                <Form.Item
                    label="Old Password"
                    name="password"
                    rules={[{ required: true, message: 'Required field!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: 'Required field (min lenght 7)!', min: 7 }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                const password = getFieldValue('newPassword');
                                if (password === value) {
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
                        <Button type="default" onClick={back} disabled={isLoading} >
                            Cancel
                        </Button>

                    </Col>
                    <Col span={4} offset={5} >
                        <Button

                            type="primary"
                            htmlType="submit"
                            disabled={isLoading}
                            icon={<CloudUploadOutlined />}
                            loading={isLoading}
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