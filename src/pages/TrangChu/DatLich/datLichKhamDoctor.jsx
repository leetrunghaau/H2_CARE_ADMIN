import { Avatar, Button, Col, DatePicker, Divider, Form, Input, message, notification, Radio, Row } from "antd"
import Footer from "../../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../../components/TrangChu/Header/HeaderViewDoctor"
import { PhoneOutlined, UserOutlined } from "@ant-design/icons"
import './styleDatLich.scss'
import { BsFillCalendar2DateFill } from "react-icons/bs"
import { FaRegHospital } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { datLichKhamBenh, datLichKhamBenhVnPay, fetchDoctorByNgayGio } from "../../../services/apiDoctor"
import moment from "moment"
import { HiOutlineMailOpen } from "react-icons/hi"
import { IoAddCircleSharp, IoLocationSharp } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import LoginPage from "../Login/Login"
const { TextArea } = Input;
const PageDatLichKham = () => {

    const location = useLocation(); // Lấy location
    const queryParams = new URLSearchParams(location.search);
    const doctorId = queryParams.get('id');
    const idGioKhamBenh = queryParams.get('idGioKhamBenh');
    const ngayKham = queryParams.get('ngayKham');
    const [paymentMethod, setPaymentMethod] = useState('offline'); // Trạng thái mặc định là thanh toán online

    const [infoDoctorr, setInfoDoctorr] = useState(null)
    const [tenGio, setTenGio] = useState(null)
    const [ngayKhamBenh, setNgayKhamBenh] = useState(null)

    const [value, setValue] = useState(infoDoctorr?.giaKhamVN);
    const [tongtien, setTongTien] = useState(0)
    const [loadingSubmit, setLoadingSubmit] = useState(false)
    const [form] = Form.useForm()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)
    const acc = useSelector(s => s.account.user)

    console.log("doctorId: ", doctorId);
    console.log("idGioKhamBenh: ", idGioKhamBenh);
    console.log("ngayKham: ", ngayKham);
    console.log("tongtien: ", tongtien);

    const handlePaymentChange = (event) => {
        console.log("e: ", event);

        setPaymentMethod(event.target.value);

    };

    useEffect(() => {
        const fetchInfoDoctor = async () => {
            if (doctorId && idGioKhamBenh && ngayKham) {
                // const res = await fetchDoctorByNgayGio(doctorId, idGioKhamBenh, ngayKham);
                const res = await fetchDoctorByNgayGio(location.search);
                console.log("res:", res);
                if (res && res.infoDoctor) {
                    setInfoDoctorr(res.infoDoctor);
                    setTenGio(res.tenGio);
                    setNgayKhamBenh(res.ngayKham);
                }
            }
        }
        fetchInfoDoctor();
    }, [doctorId, idGioKhamBenh, ngayKham])


    console.log("infoDoctorr: ", infoDoctorr);
    console.log("tenGio: ", tenGio);
    console.log("ngayKhamBenh: ", ngayKhamBenh);

    const englishToVietnameseDays = {
        'Sunday': 'Chủ nhật',
        'Monday': 'Thứ 2',
        'Tuesday': 'Thứ 3',
        'Wednesday': 'Thứ 4',
        'Thursday': 'Thứ 5',
        'Friday': 'Thứ 6',
        'Saturday': 'Thứ 7'
    };

    const formatDate = (dateString) => {
        const date = moment(dateString);
        const englishDay = date.format('dddd'); // Lấy tên ngày bằng tiếng Anh
        const vietnameseDay = englishToVietnameseDays[englishDay]; // Chuyển sang tiếng Việt
        return `${vietnameseDay} - ${date.format('DD/MM/YYYY')}`;
    }
    const formatDateDatLich = (dateString) => {
        const date = moment(dateString);
        const englishDay = date.format('dddd'); // Lấy tên ngày bằng tiếng Anh
        const vietnameseDay = englishToVietnameseDays[englishDay]; // Chuyển sang tiếng Việt
        return `${date.format('DD/MM/YYYY')}`;
    }


    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;
    };

    const handleDatLich = async (values) => {
        console.log('Received values:', values);
        const { _idDoctor, _idTaiKhoan, patientName, email,
            gender, phone, dateBenhNhan, address, lidokham,
            hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
        } = values

        if (!patientName) {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: "Vui lòng điền đầy đủ thông tin"
            })
            return
        }
        if (paymentMethod === 'online') {
            setLoadingSubmit(true)
            const res = await datLichKhamBenhVnPay(
                _idDoctor, _idTaiKhoan, patientName, email,
                gender, phone, dateBenhNhan, address, lidokham,
                hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
            )
            console.log("res dat lich: ", res);


            if (res && res.data && res.paymentUrl) {
                message.success(res.message);
                form.resetFields()
                window.open(res.paymentUrl, '_blank');
                navigate('/')
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
                })
            }
            setLoadingSubmit(false)

        } else {
            setLoadingSubmit(true)
            const res = await datLichKhamBenh(
                _idDoctor, _idTaiKhoan, patientName, email,
                gender, phone, dateBenhNhan, address, lidokham,
                hinhThucTT, tenGioKham, ngayKhamBenh, giaKham
            )
            console.log("res dat lich: ", res);


            if (res && res.data) {
                message.success(res.message);
                form.resetFields()
                navigate('/')
            } else {
                notification.error({
                    message: 'Đã có lỗi xảy ra',
                    description: res.message
                })
            }
            setLoadingSubmit(false)
        }
    }
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
    const idKH = acc?._id
    useEffect(() => {
        if (infoDoctorr) {
            form.setFieldsValue({
                // thongTinDoctor: `${infoDoctorr.chucVuId.map(item => item?.name).join(', ')} - ${infoDoctorr.lastName} ${infoDoctorr.firstName}`,
                // noiKham: `${infoDoctorr?.phongKhamId.name}`,
                // diaChiKham: `${infoDoctorr?.phongKhamId.address}`,
                // avtDoctor: `${infoDoctorr?.image}`,
                tenGioKham: `${tenGio?.tenGio}`,
                ngayKhamBenh: `${formatDateDatLich(ngayKhamBenh)}`,
                _idTaiKhoan: `${idKH}`,
                _idDoctor: `${infoDoctorr?._id}`
            });
        }
    }, [infoDoctorr, idKH]);

    const [openModalLogin, setOpenModalLogin] = useState(false);

    const notificationContent = () => (
        <div>
            <span>
                Vui lòng đăng nhập trước khi đặt lịch! <br /> Bấm vào đây để
            </span>
            <Button
                type="link"
                style={{ marginLeft: '8px' }}
                onClick={() => {
                    // navigator('/admin/ke-hoach-doctor')
                    setOpenModalLogin(true)
                }}
            >
                Tiến hành đăng nhập
            </Button>
        </div>
    );
    

    return (
        <>
            <HeaderViewDoctor />
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
                onFinish={handleDatLich}
                autoComplete="off"
            // loading={isSubmit}
            >
                <Row>
                    <Col className="sticky-col" span={24}>
                        <Row>
                            <Col span={10} style={{ margin: "auto", }}>
                                <Row>
                                    <Col md={4} span={4} style={{ textAlign: "center", top: "20px" }}>
                                        <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${infoDoctorr?.image}`} size={90} icon={<UserOutlined />} />
                                    </Col>
                                    <Col span={20} md={20}>
                                        <p className="txtTile">ĐẶT LỊCH KHÁM</p>
                                        <p className="txtTile" style={{ color: "#337ab7", lineHeight: "25px", fontSize: "18px" }}>
                                            {infoDoctorr ? infoDoctorr.chucVuId.map(item => item?.name).join(', ') : ''} - &nbsp;
                                            {infoDoctorr?.lastName} {infoDoctorr?.firstName}
                                        </p>
                                        <p className="txtTile">
                                            <BsFillCalendar2DateFill style={{ color: "gray", marginRight: "10px" }} />
                                            <span className="txt2" style={{ color: "#FEC206" }}>
                                                {tenGio?.tenGio} - {formatDate(ngayKhamBenh)}
                                            </span>
                                        </p>
                                        <p className="txtTile">
                                            <FaRegHospital style={{ color: "gray", marginRight: "10px" }} />
                                            <span>Phòng khám {infoDoctorr?.phongKhamId.name}</span>
                                            <p style={{ marginLeft: "25px", fontWeight: "350" }}>{infoDoctorr?.phongKhamId.address}</p>
                                        </p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        {/* the input an luu cac gia tri de truyen len server */}
                        <Row>
                            <Form.Item name="_idTaiKhoan" hidden> <Input /> </Form.Item>
                            {/* <Form.Item name="thongTinDoctor" hidden> <Input /> </Form.Item>
                                <Form.Item name="noiKham" hidden> <Input /> </Form.Item>
                                <Form.Item name="diaChiKham" hidden> <Input /> </Form.Item>
                                <Form.Item name="avtDoctor" hidden> <Input /> </Form.Item> */}
                            <Form.Item name="tenGioKham" hidden> <Input /> </Form.Item>
                            <Form.Item name="ngayKhamBenh" hidden> <Input /> </Form.Item>
                            <Form.Item name="_idDoctor" hidden> <Input /> </Form.Item>
                        </Row>
                    </Col>

                    <Col span={24} style={{ marginTop: "10px" }}>
                        <Row>
                            <Col span={10} style={{ margin: "auto", }}>
                                <Row gutter={[20, 20]}>
                                    <Col span={22} md={22} xs={24} sm={24} style={{ margin: "auto" }}>
                                        <Form.Item
                                            name="giaKham"
                                            rules={[{ required: true, message: 'Vui lòng chọn giá khám!' }]}
                                            initialValue={infoDoctorr?.giaKhamVN}
                                        >
                                            <Radio.Group onChange={onChange} value={value}>
                                                <Row gutter={[20, 0]}>
                                                    <Col span={11} md={11} xs={24} sm={24} style={{ marginRight: '1px' }} className={`giaKhamdiv ${value === infoDoctorr?.giaKhamVN ? 'active1' : ''}`}>
                                                        <Radio value={infoDoctorr?.giaKhamVN} onClick={() => setTongTien(infoDoctorr?.giaKhamVN)}>
                                                            Giá Khám Người Việt Nam <br />
                                                            <span style={{ color: "red" }}>{formatCurrency(infoDoctorr?.giaKhamVN)}</span>
                                                        </Radio>
                                                    </Col>
                                                    <Col span={11} md={11} xs={24} sm={24} className={`giaKhamdiv ${value === infoDoctorr?.giaKhamNuocNgoai ? 'active1' : ''}`}>
                                                        <Radio value={infoDoctorr?.giaKhamNuocNgoai} onClick={() => setTongTien(infoDoctorr?.giaKhamNuocNgoai)}>
                                                            Giá Khám Người Nước Ngoài <br />
                                                            <span style={{ color: "red" }}>{formatCurrency(infoDoctorr?.giaKhamNuocNgoai)}</span>
                                                        </Radio>
                                                    </Col>
                                                </Row>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="patientName"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập thông tin.',
                                                },
                                                {
                                                    pattern: new RegExp(/^(?=.{6,})(^[\p{L} ]+$)/u),
                                                    message: 'Vui lòng nhập HỌ VÀ TÊN CÓ DẤU, tối thiểu 6 ký tự và không chứa ký tự đặc biệt. Lịch khám sẽ bị TỪ CHỐI nếu để sai thông tin.',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input
                                                size="large"
                                                placeholder="Họ tên bệnh nhân (bắt buộc)"
                                                prefix={<UserOutlined />}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="gender"
                                            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                                        >
                                            <Radio.Group onChange={onChange} value={true}>
                                                <Radio value={true}>Nam</Radio>
                                                <Radio value={false}>Nữ</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="phone"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập thông tin.',
                                                },
                                                {
                                                    pattern: /^0\d{9}$/,
                                                    message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input
                                                size="large"
                                                placeholder="Số điện thoại liên hệ (bắt buộc)"
                                                prefix={<PhoneOutlined />}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập thông tin.',
                                                },
                                                {
                                                    type: "email",
                                                    message: 'Vui lòng nhập đúng định dạng địa chỉ email',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input
                                                size="large"
                                                placeholder="Địa chỉ email (yêu cầu điền đúng, lịch sẽ được gửi về email)"
                                                prefix={<HiOutlineMailOpen />}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="dateBenhNhan"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn ngày/tháng/năm sinh',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            {/* <Input
                                                size="large"
                                                placeholder="Ngày/Tháng/Năm Sinh (bắt buộc)"
                                                type="date"
                                                format="DD/MM/YYYY"
                                            /> */}
                                            <DatePicker
                                                placeholder="Ngày/Tháng/Năm Sinh (bắt buộc)"
                                                style={{ width: "100%" }}
                                                format="DD/MM/YYYY" // Định dạng ngày/tháng/năm
                                    />

                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập địa chỉ chi tiết của bạn',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <Input
                                                size="large"
                                                placeholder="Địa chỉ của bạn"
                                                prefix={<IoLocationSharp />}
                                            />

                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" >
                                        <Form.Item
                                            name="lidokham"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập lí do khám',
                                                },
                                            ]}
                                            hasFeedback
                                        >
                                            <TextArea
                                                size="large"
                                                placeholder="Lý do khám"
                                                prefix={<IoAddCircleSharp />}
                                                rows={4} //  số dòng hiển thị
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} className="cac-the-input" style={{ marginTop: "-30px", }} >
                                        <p style={{
                                            color: "navy",
                                            fontWeight: "500",
                                            fontSize: "16px",
                                            marginBottom: "5px"
                                        }}>Hình thức thanh toán</p>
                                        <Form.Item
                                            name="hinhThucTT"
                                            rules={[{ required: true, message: 'Vui lòng chọn hình thức thanh toán!' }]}
                                        >
                                            <Radio.Group onChange={handlePaymentChange} value="offline">
                                                <Radio style={{ fontSize: "16px" }} value="offline">Thanh toán sau tại cơ sở y tế</Radio>
                                                <Radio style={{ fontSize: "16px" }} value="online">Thanh toán Online </Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} sm={24} className="cac-the-input divTT">
                                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                                            <p className="txtTT">Giá khám</p>
                                            <p className="txtTT">{formatCurrency(tongtien)}</p>
                                        </div>
                                        <div style={{ justifyContent: "space-between", display: "flex", }}>
                                            <p className="txtTT">Phí đặt lịch</p>
                                            <p className="txtTT">Miễn phí</p>
                                        </div>
                                        <hr style={{ marginTop: "5px", width: "95%", border: "1px solid #f4eeee" }} />
                                        <div style={{ justifyContent: "space-between", display: "flex" }}>
                                            <p className="txtTT">Tổng cộng</p>
                                            <p className="txtTT" style={{ color: "red" }}>{formatCurrency(tongtien)}</p>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24} style={{ textAlign: "center" }}>
                                        <p>Quý khách vui lòng điền đầy đủ thông tin để tiết kiệm thời gian làm thủ tục khám</p>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={23} md={23} sm={24} className="cac-the-input divTT" style={{ backgroundColor: "#D4EFFC" }}>
                                        <div>
                                            <p className="txtTTT" style={{ fontWeight: "500" }}>LƯU Ý</p>
                                            <p className="txtTTT">Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ sơ khám bệnh, khi điền thông tin anh/chị vui lòng:</p>
                                            <ul>
                                                <li style={{ fontSize: "15px" }}>Ghi rõ họ và tên, viết hoa những chữ cái đầu tiên, ví dụ: <span style={{ fontWeight: "500" }}>Nguyễn Văn A</span> </li>
                                                <li style={{ fontSize: "15px" }}>Điền đầy đủ, đúng và vui lòng kiểm tra lại thông tin trước khi ấn "Xác nhận"</li>
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>

                                <br />
                                <Row>
                                    <Col span={23} className="cac-the-input">
                                        <Form.Item>
                                            <Button
                                                style={{
                                                    backgroundColor: 'orange',
                                                    fontSize: "18px",
                                                    borderColor: 'orange',
                                                    color: 'white', fontWeight: "500"
                                                }}
                                                // htmlType="submit"
                                                size="large"
                                                onClick={() => {
                                                    if (!isAuthenticated) {
                                                        notification.warning({
                                                            message: 'Cảnh báo',
                                                            // description: 'Vui lòng đăng nhập trước khi đặt lịch.',
                                                            description: notificationContent(),
                                                            placement: 'topRight',
                                                        });
                                                        return;
                                                    } else {
                                                        form.submit(); // Proceed to submit the form
                                                    }
                                                }}
                                                block
                                                loading={loadingSubmit}
                                            >Xác nhận đặt khám</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className="cac-the-input" span={23} style={{ textAlign: "center", marginTop: "-25px" }}>
                                        <p>Bằng việc xác nhận đặt khám, bạn đã hoàn toàn đồng ý với <a href="#">Điều khoản sử dụng dịch vụ</a> của chúng tôi.</p>
                                    </Col>
                                </Row>

                                <LoginPage
                                    openModalLogin={openModalLogin}
                                    setOpenModalLogin={setOpenModalLogin}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <Footer />
        </>
    )
}

export default PageDatLichKham