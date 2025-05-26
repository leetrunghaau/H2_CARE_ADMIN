import { Button, Col, Divider, Form, Input, message, notification, Radio, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callRegister } from "../../services/api";

const Register = () => {

    const [formRegister] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        const {email, password, firstName, lastName, address, phone, gender} = values
        console.log('Success:', email, password, firstName, lastName, address, phone, gender);
        
        // Giả sử giá trị 'gender' là 'other', bạn có thể xử lý khác biệt ở đây
        // const genderText = values.gender === true ? 'Nam' : values.gender === false ? 'Nữ' : 'Bê Đê';
        // message.success(`Bạn vừa chọn giới tính là: ${genderText}`);

        setIsLoading(true)
        const res = await callRegister(email, password, firstName, lastName, address, phone, gender)
        console.log("res: ", res);
        if(res.data){
            message.success(res.message)
            formRegister.resetFields()
            navigate("/admin/login-admin")
        } else {
            notification.error({ 
                message: "Đăng ký không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Hàm để tạo mật khẩu ngẫu nhiên
    const generateRandomPassword = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    };

    return (
        <Row justify="center" style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <Form      
                    form={formRegister}                           
                    initialValues={{
                        remember: true,
                    }}
                    // layout='vertical'    
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{ maxWidth: '1000px', margin: '0 auto' }} // Đặt maxWidth và căn giữa
                >
                    <h3 style={{ textAlign: "center", color: "navy", textTransform: 'uppercase', fontSize: "20px" }}>Đăng ký tài khoản người dùng</h3>
                    <Divider />

                    <Row gutter={[20,20]}>
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
                    </Row>                    

                    <Row gutter={[20,20]}>
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
                    </Row>                             

                    <Row gutter={[20,20]}>
                        <Col md={12} sm={12} xs={24}>
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

                        <Col md={12} sm={12} xs={24}>
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
                    </Row>

                    <Row>
                        <Col md={24}>
                            <Form.Item
                                label="Giới tính"
                                name="gender"
                                rules={[{ required: true, message: 'Vui lòng chọn một tùy chọn!' }]}
                            >
                            <Radio.Group style={{marginLeft: "30px"}}>
                                <Radio value={true}>Nam</Radio>
                                <Radio value={false}>Nữ</Radio>
                                {/* <Radio value="undefined">Khác</Radio> */}
                            </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>     

                    
                    
                    <Form.Item>
                        <Button type="primary" onClick={() => formRegister.submit()} loading={isLoading}> Đăng ký tài khoản</Button>

                        <Button style={{marginLeft: "30px"}} type="primary" danger onClick={() => {
                            console.log("check form: ", formRegister.getFieldsValue());
                            // form.getFieldsValue()
                            const randomPassword = generateRandomPassword(10); // Sinh mật khẩu với độ dài 10 ký tự
                            formRegister.setFieldsValue({
                                password: randomPassword,
                            })
                        }}>Tự tạo mật khẩu</Button>
                    </Form.Item>

                </Form> 
            </Col>
        </Row>  
    )
}
export default Register