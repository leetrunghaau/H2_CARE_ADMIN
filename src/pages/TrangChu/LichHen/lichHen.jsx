import { Avatar, Button, Col, Divider, message, Modal, notification, Popconfirm, Row, Tooltip } from "antd"
import Footer from "../../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../../components/TrangChu/Header/HeaderViewDoctor"
import './lichhen.scss'
import { IoHomeSharp } from "react-icons/io5"
import { CheckCircleTwoTone, CloseOutlined, ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons"
import { MdAccessTimeFilled } from "react-icons/md"
import { BsCalendar2Date } from "react-icons/bs"
import icKham from '../../../assets/ic_kham.b8b58dd8.png'; // Import the image
import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { fetchLichKham, handleHuyOrder } from "../../../services/apiDoctor"
import { FaRegEye } from "react-icons/fa"
import ModalLichHen from "./ModalLichHen"


const LichHen = () => {

    let location = useLocation();
    // Phân tích cú pháp query string
    let params = new URLSearchParams(location.search);
    const idKhachHang = params.get("idKhachHang"); // Lấy giá trị của tham số "idKhachHang"

    console.log("check idKhachHang: ", idKhachHang);
    const [dataLichHen, setDataLichHen] = useState([])
    console.log("check dataLichHen: ", dataLichHen);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [openModalId, setOpenModalId] = useState(null); // Track which modal is open
    const handleModalOpen = (id) => {
        setOpenModalId(id); // Open specific modal
    }

    const handleModalClose = () => {
        setOpenModalId(null); // Close the modal
    }

    useEffect(() => {
        fetchLichHenByIdKH();
    }, [idKhachHang]);

    const fetchLichHenByIdKH = async () => {

        const res = await fetchLichKham(idKhachHang)
        console.log("res: ", res);
        if (res && res.data) {
            setDataLichHen(res.data)
        }
    }

    const handleHuyLich = async (id) => {
        console.log("id huy: ", id);
        let res = await handleHuyOrder(id)
        if (res && res.data) {
            message.success(res.message)
            await fetchLichHenByIdKH()
        } else {
            notification.error({
                message: 'Hủy lịch hẹn không thành công!',
                description: res.message
            })
        }
    }

    return (
        <>
            <HeaderViewDoctor />
            <Row>
                <Col span={18} className="col-body">
                    <Row>
                        <Col span={24}>
                            <p className="txt-title"><IoHomeSharp /> / Lịch hẹn đã đặt</p>
                            {/* <Divider/> */}
                            <hr style={{ border: "1px solid rgb(243, 243, 243)" }} />
                        </Col>
                        <Col span={24}>
                            <p className="title-lichhen">Lịch hẹn đã đặt</p>
                        </Col>
                        {dataLichHen?.some(item => item?.trangThaiHuyDon === 'Không Hủy') ? (
                            dataLichHen.map((item, index) => (
                                item?.trangThaiHuyDon === 'Không Hủy' ? (
                                    <Col key={index} span={21} className="box-lich-kham">
                                        <Row gutter={[0, 20]}>
                                            {!item?.trangThaiKham ? <>
                                                <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                    <Tooltip title="Huỷ lịch này" color={'red'} key={'red'}>
                                                        <Popconfirm
                                                            title={`Huỷ lịch này`}
                                                            description="Bạn có chắc chắn muốn hủy?"
                                                            onConfirm={() => handleHuyLich(item._id)}
                                                            onCancel={() => message.error('no delete')}
                                                            okText="Xác nhận hủy"
                                                            cancelText="Không hủy"
                                                        >
                                                            <CloseOutlined style={{ cursor: "pointer", color: "red", fontSize: "20px" }} />
                                                        </Popconfirm>
                                                    </Tooltip>
                                                </Col>
                                            </> : ''}
                                            <Col span={6} className="ben-trai">
                                                <Avatar
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item?._idDoctor.image}`}
                                                    style={{ backgroundColor: 'white', border: "1px solid red" }}
                                                    icon={<UserOutlined />}
                                                    size={90}
                                                />
                                                <p className="kham">Thời Gian Khám</p>
                                                <p className="txt-trai">
                                                    <MdAccessTimeFilled size={30} /> &nbsp;
                                                    <span style={{ top: "-7px", position: "relative" }}>{item.tenGioKham}</span>
                                                </p>
                                                <p className="txt-trai">
                                                    <BsCalendar2Date /> &nbsp;
                                                    <span>{item.ngayKhamBenh}</span>
                                                </p>
                                            </Col>
                                            <Col span={17} style={{ paddingLeft: "20px", marginBottom: "20px" }}>
                                                <p className="txt-phai-benhnhan">Bệnh nhân: {item.patientName}</p>
                                                <p className="txt-phai" style={{ color: "rgb(69, 195, 210)" }}>
                                                    {item._idDoctor ? item._idDoctor.chucVuId.map(items => items?.name).join(', ') : ''}
                                                </p>
                                                <p className="txt-phai">
                                                    Bác sĩ: <span style={{ color: "rgb(69, 195, 210)" }}>{item._idDoctor?.lastName} {item._idDoctor?.firstName}</span>
                                                </p>
                                                <p className="txt-phai">Nơi khám: {item._idDoctor?.phongKhamId?.name}</p>
                                                <p className="txt-phai">Địa chỉ:
                                                    <span style={{ lineHeight: "25px", fontSize: "18px", marginLeft: "5px" }}>{item._idDoctor?.phongKhamId?.address}</span>
                                                </p>
                                                <p className="txt-phai">Lí do khám: <span style={{ marginLeft: "5px" }}>{item.lidokham}</span></p>
                                                {item.trangThaiXacNhan ? <>
                                                    <Button size="large" type="primary" style={{ color: "#52c41a", border: "1px solid #52c41a" }} ghost icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
                                                        Đã xác nhận
                                                    </Button>
                                                </> : <>
                                                    <Button size="large" danger loading={true}>
                                                        Chờ xác nhận
                                                    </Button>
                                                </>}
                                                {item.trangThaiThanhToan ? <>
                                                    <Button size="large" type="primary" style={{  marginLeft: "20px" , color: "#52c41a", border: "1px solid #52c41a" }} ghost icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}>
                                                        Đã thanh toán
                                                    </Button>
                                                </> : <>
                                                    <Button size="large" danger icon={<ExclamationCircleOutlined />} style={{ marginLeft: "20px" }}>
                                                        Chưa thanh toán
                                                    </Button>
                                                </>}

                                                {item.trangThaiKham ? <>
                                                    <Button
                                                        key={index}
                                                        size="large"
                                                        onClick={() => handleModalOpen(item._id)}
                                                        type="primary"
                                                        style={{ color: "#52c41a", border: "1px solid #52c41a", marginLeft: "20px" }} ghost icon={<FaRegEye twoToneColor="#52c41a" />}>
                                                        Xem bệnh án
                                                    </Button>
                                                </> : ''}

                                                <ModalLichHen
                                                    isModalOpen={openModalId === item._id}
                                                    setIsModalOpen={handleModalClose}
                                                    item={item}
                                                />
                                            </Col>
                                            <Col span={22} style={{ margin: "auto" }}>
                                                <hr style={{ border: "1px solid rgb(235, 235, 235)" }} />
                                            </Col>
                                            <Col span={15} style={{ margin: "auto" }}>
                                                <div className="hdsd">
                                                    <p style={{ fontWeight: "500" }}>Hướng dẫn đi khám</p>
                                                    <p style={{ fontStyle: "italic" }}><a href="#">Xem chi tiết</a></p>
                                                </div>
                                                <hr style={{ border: "1px solid rgb(235, 235, 235)" }} />
                                            </Col>
                                        </Row>
                                    </Col>
                                ) : null
                            ))
                        ) : (
                            <Col span={21} className="box-lich-kham">
                                <p style={{ textAlign: "center", color: "red", fontSize: "30px" }}>Chưa có lịch khám nào.</p>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
            <Footer />
        </>
    )
}
export default LichHen