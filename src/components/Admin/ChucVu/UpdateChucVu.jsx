import { Col, Divider, Form, Input, message, Modal, notification, Row } from "antd"
import { useEffect, useState } from "react";
import { updateChucVu } from "../../../services/apiDoctor";

const UpdateChucVu = (props) => {

    const {
        openUpdateChucVu, setOpenUpdateChucVu,
        dataUpdateChucVu, setDataUpdateChucVu,
        fetchListChucVu
    } = props

    const [formm] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {

        if(dataUpdateChucVu?._id) {

            const init = {
                _id: dataUpdateChucVu?._id,
                name: dataUpdateChucVu?.name,
                description: dataUpdateChucVu?.description,
            }
            formm.setFieldsValue(init)

        }
        return () => {
            formm.resetFields();
        }
    }, [dataUpdateChucVu])

    const handleCancel = () => {
        setOpenUpdateChucVu(false);
        formm.resetFields()
    };

    const handleUpdateChucVu = async (values) => {

        const {_id, name, description} = values
        setIsSubmit(true)
        const res = await updateChucVu(_id, name, description)
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
         <Modal
            title="Chỉnh sửa thông tin chức vụ"
            open={openUpdateChucVu}
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
                    onFinish={handleUpdateChucVu}
                    autoComplete="off"
                    loading={isSubmit}
                >
                    <Row gutter={[20,5]}>
                        <Col hidden>
                                <Form.Item
                                    hidden
                                    labelCol={{ span: 24 }}
                                    label="ID"
                                    name="_id"
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
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
    )
}
export default UpdateChucVu