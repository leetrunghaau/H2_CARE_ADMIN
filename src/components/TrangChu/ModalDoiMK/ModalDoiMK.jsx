import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Divider, Form, Input, message, Modal, notification, Row, Upload } from "antd"
import { useEffect, useState } from "react"
import { callUploadDoctorImg } from "../../../services/apiDoctor"
import { FaSave } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { doiThongTinKH, fetchOneAccKH } from "../../../services/api"
import { useNavigate } from "react-router-dom"
import { doLogoutAction } from "../../../redux/account/accountSlice"
import bcrypt from 'bcryptjs-react';
import { v4 as uuidv4 } from 'uuid';

const ModalDoiMK = (props) => {

    const {
        openModalDoiMK, setOpenModalDoiMK
    } = props
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formDoiMK] = Form.useForm()
    const [fileList, setFileList] = useState([]);
    const [imageUrl, setImageUrl] = useState('');    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataAccKH, setDataAccKH] = useState(null);
    const acc = useSelector(state => state.account.user)

    console.log("dataAccKH: ", dataAccKH);
    
    const cancel = () => {
        setOpenModalDoiMK(false)
    }

    const fetchOneAcc = async () => {
        let id = `id=${acc._id}`
        const res = await fetchOneAccKH(id)
        console.log("res tk: ", res.data?.[0]);
        
        if (res && res.data) {
            setDataAccKH(res.data?.[0])            
        }
    }

    const onFinishDoiMK = async (values) => {

        const {
            _idAcc, lastName, firstName, email, phone, address, password, passwordMoi
        } = values
        console.log("password: ", password);
        console.log("lastName, firstName, email, phone, address, passwordMoi: ", lastName, firstName, email, phone, address, passwordMoi);

        const matKhauCu = dataAccKH?.password
        console.log("mk cu: ", matKhauCu);
        
        const isMatch = await bcrypt.compare(password, matKhauCu); // So sánh password nhập vào với mật khẩu đã mã hóa

        const hinhAnh = imageUrl.split('/').pop();
        console.log("hinhAnh: ",hinhAnh);
        

        if (isMatch) {
            console.log("Mật khẩu cũ chính xác. Cập nhật mật khẩu mới...");

            const res = await doiThongTinKH(_idAcc, lastName, firstName, email, phone, address, passwordMoi, hinhAnh)
            if(res && res.data) {
                message.success(res.message)
                dispatch(doLogoutAction())
                navigate("/");
                setOpenModalDoiMK(false)
                message.success('Yêu cầu đăng nhập lại!')
                setImageUrl('')                
            } else {
                notification.error({ 
                    message: "Đổi thông tin thất bại!",
                    description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                    duration: 5,
                });
            }

        } else {
            notification.error({
                message: "Mật khẩu cũ không chính xác",
                description: "Vui lòng nhập lại mật khẩu cũ đúng."
            });
        }

    }

    useEffect(() => {
        fetchOneAcc()
    },[acc._id])  

    useEffect(() => {
        if (dataAccKH) {     
            if (dataAccKH.image) {    
                setFileList([
                    {
                        uid: uuidv4(),
                        name: dataAccKH.image, // Tên file
                        status: 'done', // Trạng thái 
                        url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataAccKH.image}`, // Đường dẫn đến hình ảnh
                    },
                ]);
            }              
            const init = {
                _idAcc: dataAccKH?._id,                
                firstName: dataAccKH?.firstName,                
                lastName: dataAccKH?.lastName,                
                email: dataAccKH?.email,                
                phone: dataAccKH?.phone,                
                address: dataAccKH?.address,                                
                image: dataAccKH?.image,                                
            }
            console.log("init: ", init);
            setImageUrl(dataAccKH?.image)    
            formDoiMK.setFieldsValue(init);            
        }
        return () => {
            formDoiMK.resetFields();
        }
    },[dataAccKH])

    // upload ảnh    
    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await callUploadDoctorImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrl(res.url); // URL của hình ảnh từ server
                onSuccess(file);
                setFileList([ // Đặt lại fileList chỉ chứa file mới
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh từ server
                    },
                ]);
                // setDataImage()
                message.success('Upload thành công');
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
        setFileList([]); // Reset fileList khi xóa file
        setImageUrl(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };
    // mở đóng modal hình ảnh
    const handlePreview = async (file) => {
        setImageUrl(fileList[0].url); // Lấy URL của hình ảnh
        setIsModalVisible(true); // Mở modal
    };

    return (
        <Modal title="Thông tin của bạn" 
        open={openModalDoiMK} 
        // onOk={handleOk} 
        style={{top: 30}}
        onCancel={cancel}
        footer={null}
        width={700}
        maskClosable={false}
        >
            <Divider/>
            <Form
                form={formDoiMK}
                layout="vertical"
                onFinish={onFinishDoiMK}                 
            >
                <Row gutter={[20,10]}>
                    <Col span={24} md={24} sm={24} xs={24}> 
                    <Form.Item name="_idAcc" hidden><Input hidden /></Form.Item>
                        <Form.Item
                            label="Upload Ảnh đại diện"
                            name="image"                                                
                            hasFeedback
                        >
                            <Upload
                                name="file"
                                listType="picture-card"
                                className="avatar-uploader"
                                maxCount={1}
                                multiple={false}
                                customRequest={handleUploadFileImage}
                                beforeUpload={beforeUpload}
                                onChange={handleChange}
                                onRemove={handleRemoveFile}
                                fileList={fileList} // Gán danh sách file
                                onPreview={handlePreview}
                            >
                                <div>
                                    {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>

                            <Modal
                                visible={isModalVisible}
                                footer={null}
                                title="Xem Hình Ảnh"
                                onCancel={() => setIsModalVisible(false)}
                            >
                                <img alt="Uploaded" style={{ width: '100%' }} src={imageUrl} />
                            </Modal>
                        </Form.Item>                       
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
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
                            <Input placeholder="Nhập họ của bạn" />
                        </Form.Item>
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
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
                            <Input placeholder="Nhập tên của bạn" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={24} sm={24} xs={24}>
                        <Form.Item
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
                        ><Input disabled placeholder="Nhập email của bạn" />
                        </Form.Item>
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
                        <Form.Item
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
                            <Input placeholder='Ví dụ: 0972138493' />
                        </Form.Item> 
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
                        <Form.Item
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
                            <Input placeholder='Nhập địa chỉ...' />
                        </Form.Item> 
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Mật khẩu cũ"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đầy đủ thông tin!',
                                },                                                    
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='Nhập mật khẩu cũ' />
                        </Form.Item> 
                    </Col>
                    <Col span={12} md={12} sm={24} xs={24}>
                        <Form.Item
                            label="Mật khẩu mới"
                            name="passwordMoi"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập đầy đủ thông tin!',
                                },                                                    
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder='Nhập mật khẩu muốn đổi mới' />
                        </Form.Item> 
                    </Col>
                    <Col span={24} style={{display: "flex", justifyContent: "center"}}>
                        <Button onClick={() => formDoiMK.submit()} type="primary" size="large" icon={<FaSave size={25} />}>Đổi thông tin</Button>
                    </Col>
                </Row>
            </Form> 
        </Modal>
    )
}
export default ModalDoiMK