import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, Input, message, notification, Row } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { callLogin } from "../../services/api";

const Login = () => {

    const [formLogin] = Form.useForm()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [remember, setRemember] = useState(false); // Trạng thái của checkbox "Ghi nhớ tài khoản"

    // Kiểm tra access_token khi component load
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
            // Nếu đã có token, điều hướng đến trang admin
            navigate("/admin/home-page-admin");
        }
    }, [navigate]);
    
    // Khi trang load, kiểm tra xem có dữ liệu trong localStorage không
    useEffect(() => {
        const rememberedAccount = localStorage.getItem("rememberedAccount");
        if (rememberedAccount) {
            const account = JSON.parse(rememberedAccount);
            formLogin.setFieldsValue({
                email: account.email,
                password: account.password,
                remember: true,
            });
            setRemember(true);
        }
    }, [formLogin]);

    const onFinish = async (values) => {
        console.log("kết quả values: ", values);
        const {email, password } = values

        setIsLoading(true)
        const res = await callLogin(email, password)
        console.log("res login: ", res);
        
        if(res.data){
            localStorage.setItem("access_token", res.access_token)
            localStorage.setItem("lastName", res.data.lastName);
            localStorage.setItem("firstName", res.data.firstName);
            message.success("Đăng nhập thành công!")

            if (remember) {
                // Nếu người dùng chọn "Ghi nhớ tài khoản", lưu thông tin vào localStorage
                localStorage.setItem("rememberedAccount", JSON.stringify({ email, password }));
            } else {
                // Nếu không chọn, xóa dữ liệu đã lưu (nếu có)
                localStorage.removeItem("rememberedAccount");
            }
            
            navigate("/admin/home-page-admin")
            
        } else {
            notification.error({ 
                message: "Đăng nhập không thành công!",
                description:
                    res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsLoading(false)
    }

    return (
        <Row justify="center" style={{ marginTop: "100px" }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset style={{
                            padding: "15px",
                            margin: "5px",
                            border: "1px solid #ccc",
                            borderRadius: "5px"
                    }}>
                        <legend>Đăng Nhập</legend>
                        <Form
                            form={formLogin}
                            layout="vertical"
                            onFinish={onFinish} 
                        >
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
                                >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                    label="Password"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Password không được để trống!',
                                        },  
                                        {
                                            required: false,
                                            pattern: new RegExp(/^(?!.*\s).{6,}$/),
                                            message: 'Không được nhập có dấu cách, tối thiểu có 6 kí tự!',
                                        },                                  
        
                                    ]}
                                    hasFeedback
                                >
                                <Input.Password onKeyDown={(e) => {
                                    console.log("check key: ", e.key);
                                    if(e.key === 'Enter') formLogin.submit()
                                }} />
                            </Form.Item>                            

                            <Form.Item >
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <Button loading={isLoading} 
                                            type="primary" 
                                            onClick={() => formLogin.submit()}>
                                        Đăng nhập 
                                    </Button>
                                    <Link to="/">Trở về trang chủ <ArrowRightOutlined /></Link>
                                </div>
                            </Form.Item>

                            <Form.Item
                                name="remember"
                                valuePropName="checked"                                
                            >
                                <Checkbox
                                    checked={remember}
                                    onChange={(e) => setRemember(e.target.checked)}
                                >Ghi nhớ tài khoản</Checkbox>
                            </Form.Item>
                        </Form>
                        <Divider />
                        <div style={{ textAlign: "center" }}>
                            Chưa có tài khoản? <Link to={"/admin/register-admin"}>Đăng ký tại đây</Link>
                        </div>

                    </fieldset>
                </Col>
        </Row>
    )
}
export default Login