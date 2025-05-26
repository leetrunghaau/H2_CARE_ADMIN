import { Col, Divider, Form, Input, message, Modal, notification, Row, Upload } from "antd";
import { useState } from "react";
import { callUploadDoctorImg, createBenhNhan } from "../../../services/apiDoctor";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const CreateBN = (props) => {
    const {
        openCreateChuyenKhoa, setOpenCreateChuyenKhoa, fetchListCK
    } = props

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    // hiển thị hình ảnh dạng modal khi upload muốn xem lại
    const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);

    const handleCreateBN = async (values) => {
        const {email, password, firstName, lastName, image, phone, address} = values              

        if (!imageUrl) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh'
            })
            return;
        }
        
        const hinhAnh = imageUrl.split('/').pop(); // Lấy tên file từ URL
        console.log("hinhanh: ", hinhAnh);

        setIsSubmit(true)
        const res = await createBenhNhan(email, password, firstName, lastName, phone, hinhAnh, address)

        if(res && res.data){
            message.success('Tạo mới thông tin khách hàng thành công');
            form.resetFields();
            setImageUrl('');
            setOpenCreateChuyenKhoa(false);
            await fetchListCK()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
        setIsSubmit(false)
    };

    const handleCancel = () => {
        setOpenCreateChuyenKhoa(false);
        setImageUrl('')
        form.resetFields()
    };

    // upload ảnh    
    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await callUploadDoctorImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrl(res.url); // URL của hình ảnh từ server
                onSuccess(file);
                // setDataImage()
                // message.success('Upload thành công');
            } else {
                onError('Đã có lỗi khi upload file');
            }            
        } catch (error) {
            console.error(error);
            message.error('Upload thất bại');
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên hình ảnh JPG/PNG!');
        }
        return isJpgOrPng;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`upload file ${info.file.name} thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload file thất bại!`);
        }
    };

    const handleRemoveFile = (file) => {
        setImageUrl(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };

    // mở đóng modal hình ảnh
    const handlePreview = async () => {
        if (imageUrl) {
            setIsImagePreviewVisible(true);
        }
    };

    return (
        <Modal
            title="Tạo mới thông tin khách hàng"
            open={openCreateChuyenKhoa}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            width={600}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Xác nhận tạo mới"}
            cancelText="Huỷ"
        >
            <Divider />
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        name="basic"        
                        layout="vertical"                
                        style={{
                            maxWidth: "100%",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={handleCreateBN}
                        autoComplete="off"
                        loading={isSubmit}
                    >
                        <Row gutter={[20,5]}>
                        <Col md={12} sm={12} xs={24}>
                            <Form.Item
                                labelCol={{span: 24}}
                                label="Họ"
                                name="lastName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                    {
                                        required: false,
                                        pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                        message: 'Không được nhập số!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col md={12} sm={12} xs={24}>
                            <Form.Item
                                labelCol={{span: 24}}
                                label="Tên"
                                name="firstName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                    {
                                        required: false,
                                        pattern: new RegExp(/^[A-Za-zÀ-ỹ\s]+$/),
                                        message: 'Không được nhập số!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>                            
                        </Col>

                        <Col md={12} sm={12} xs={24}>
                            <Form.Item
                                labelCol={{span: 24}}
                                label="Email"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                    {
                                        type: "email",
                                        message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col md={12} sm={12} xs={24}>
                            <Form.Item
                                labelCol={{span: 24}}
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                    {
                                        required: false,
                                        pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                        message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>
                        </Col>

                        <Col md={24} sm={24} xs={24}>
                            <Form.Item
                                labelCol={{span: 24}}
                                label="Số Điện Thoại"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập đầy đủ thông tin!',
                                    },
                                    {
                                        pattern: /^0\d{9}$/,
                                        message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input />
                            </Form.Item>                          
                        </Col>

                        <Col md={24} sm={24} xs={24}>
                        <Form.Item
                            labelCol={{span: 24}}
                            label="Địa chỉ"
                            name="address"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đầy đủ thông tin!',
                                },                                    
                            ]}
                            hasFeedback
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                            <Col span={24} md={24} sm={24} xs={24} >
                                <Form.Item
                                    label="Hình ảnh"
                                    name="image"                            
                                >
                                    <Upload
                                            name="file" // Tên trùng với multer
                                            listType="picture-card"
                                            className="avatar-uploader"
                                            maxCount={1}
                                            multiple={false}
                                            customRequest={handleUploadFileImage}
                                            beforeUpload={beforeUpload}
                                            onChange={handleChange}
                                            onRemove={handleRemoveFile}
                                            onPreview={handlePreview} // Sử dụng onPreview
                                        >
                                            <div>
                                                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                                <div style={{ marginTop: 8 }}>Upload</div>
                                            </div>
                                    </Upload>

                                    <Modal
                                        visible={isImagePreviewVisible}
                                        title="Xem Hình Ảnh"
                                        footer={null}
                                        onCancel={() => setIsImagePreviewVisible(false)}
                                    >
                                        <img height={500} alt="image" style={{ width: '100%' }} src={imageUrl} />
                                    </Modal>
                                </Form.Item>
                            </Col>

                           
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Modal>
    )
}
export default CreateBN