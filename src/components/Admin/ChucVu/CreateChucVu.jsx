import { Col, Divider, Form, Input, message, Modal, notification, Row } from "antd";
import { useState } from "react";
import { createChucVu } from "../../../services/apiDoctor";


const CreateChucVu = (props) => {

    const {
        opentCreateChucVu, setOpenCreateChucVu, fetchListChucVu
    } = props
    
    const [formm] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    const handleCancel = () => {
        setOpenCreateChucVu(false);
        formm.resetFields()
    };

    const handleCreateChucVu = async (values) => {

        const {name, description} = values
        setIsSubmit(true)
        const res = await createChucVu(name, description)
        console.log("res chucvu: ", res);

        if(res && res.data) {
            message.success(res.message)
            handleCancel()
            await fetchListChucVu()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }

    return (
        <>
            <Modal
                title="Tạo mới thông tin chức vụ"
                open={opentCreateChucVu}
                onOk={() => formm.submit()} 
                onCancel={() => handleCancel()}
                width={500}
                maskClosable={false}
                confirmLoading={isSubmit}
                okText={"Xác nhận tạo mới"}
                cancelText="Huỷ"
            >
                <Divider />
                    <Form
                        form={formm}
                        name="basic"        
                        layout="vertical"                
                        style={{
                            maxWidth: "100%",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={handleCreateChucVu}
                        autoComplete="off"
                        loading={isSubmit}
                    >
                        <Row gutter={[20,5]}>
                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Tên chức vụ"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tin!',
                                        },
                                    ]}
                                >
                                <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Mô tả chức vụ"
                                    name="description"
                                    rules={[
                                        {
                                            message: 'Vui lòng nhập đầy đủ thông tin!',
                                        },
                                    ]}
                                >
                                <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                
            </Modal>
        </>
    )
}
export default CreateChucVu