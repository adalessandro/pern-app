import {
    Button,
    Form,
    Input,
    Select,
    Upload,
    Col,
    Divider,
    PageHeader,
    Row,
} from 'antd';
import { UploadOutlined, CloudUploadOutlined } from '@ant-design/icons'
import React from 'react';
import { useAddJobMutation, useUpdateJobMutation } from '../../app/services/jobs';

import { Job } from '@backend/models';
import { jobPriorities } from '../../utils/types';
import { showError } from '../../utils/helpers';
const { Option } = Select;

interface FormInterface {
    back: () => void;
    entity?: Job;

}

const AppForm: React.FC<FormInterface> = ({ back, entity, /*priorities, projectsOptions */ }) => {
    const [jobForm] = Form.useForm();
    const [addJob, { isLoading: isLA, isSuccess: isSA, error }] = useAddJobMutation()
    const [updateJob, { isLoading: isLU, isSuccess: isSU }] = useUpdateJobMutation()


    let save = addJob;
    let loading = isLA;
    let success = isSA;
    if (entity !== undefined) {
        save = updateJob;
        loading = isLU;
        success = isSU;
    }

    const onFinish = async (data: any) => {
        
        const paylod = {
            ...data,
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
        console.log('Failed:', errorInfo);
    };

    const setInitialValues = (entity: Job) => {
        return ({
            ...entity,
        })
    }


    return (
        <PageHeader
            ghost={false}
            onBack={back}
            title='Job'
            subTitle={entity ? 'edit' : 'new'}
        >

            <Form
                name="job"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 9 }}
                initialValues={entity ? setInitialValues(entity) : {}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                form={jobForm}
            >

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Required field!' }]}
                >
                    <Input />
                </Form.Item>


                <Row>
                    <Col >
                        <Button type="default" onClick={back} disabled={loading} >
                            Cancel
                        </Button>

                    </Col>
                    <Col offset={8} >
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

export default AppForm;