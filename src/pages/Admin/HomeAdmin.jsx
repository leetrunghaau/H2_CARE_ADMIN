import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, HomeOutlined, HomeTwoTone, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Row, Select, Switch } from 'antd';
import { FaUserDoctor } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import MenuNav from '../../components/Admin/Menu/Menu';
import Login from './Login';
import BodyAdmin from '../../components/Admin/BodyAdmin/BodyAdmin';
import AdminLayout from '../../components/Admin/AdminLayout';
import { fetchAllDoctor, handleThongKe } from '../../services/apiDoctor';

const HomeAdmin = () => {

    const navigate = useNavigate();
    const [dataDoctor, setDataDoctor] = useState('')
    const [dataIdDoctor, setDataIdDoctor] = useState('')
    const [dataThongKe, setDataThongKe] = useState('')
    const [trangThaiKhamSelect, setTrangThaiKhamSelect] = useState('')

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            // Nếu không có token, điều hướng về trang đăng nhập
            navigate("/admin/login-admin");
        }
    }, [navigate]);

    useEffect(() => {
        fetchAllDoctors()
    }, [])

    useEffect(() => {
        handleThongKeCaKham()
    }, [dataIdDoctor, trangThaiKhamSelect])

    const fetchAllDoctors = async () => {
        let query = `page=1&limit=1000`
        const res = await fetchAllDoctor(query)
        console.log("res doctor: ", res);
        if (res && res.data) {
            setDataDoctor(res.data)
        }
    }

    const handleDoctorChange = (e) => {
        console.log("e doctor: ", e);
        setDataIdDoctor(e)
    }

    const handleTrangThaiKham = (e) => {
        console.log("e trạng thái: ", e);
        setTrangThaiKhamSelect(e)
    }

    const handleThongKeCaKham = async () => {

        let res = await handleThongKe(trangThaiKhamSelect, dataIdDoctor)
        console.log("res thong ke: ", res);
        if (res && res.data) {
            setDataThongKe(res.data)
        }
    }

    console.log("dataThongKe: ", dataThongKe);

    // const chartData = {
    //     labels: `Thống kê các ca khám`,
    //     datasets: [{
    //         label: 'Thống kê các ca khám',
    //         data: dataThongKe?.map(item => item.totalCaKham),  // Dữ liệu doanh thu
    //         backgroundColor: [
    //             'rgb(255, 99, 132)',  // Màu 1
    //             'rgb(54, 162, 235)',  // Màu 2
    //             'rgb(255, 205, 86)',  // Màu 3
    //             'rgb(75, 192, 192)',  // Màu 4
    //             'rgb(153, 102, 255)', // Màu 5
    //             'rgb(255, 159, 64)',  // Màu 6
    //             'rgb(255, 99, 71)',   // Màu 7
    //             'rgb(0, 204, 255)',   // Màu 8
    //             'rgb(102, 205, 170)', // Màu 9
    //             'rgb(255, 165, 0)',   // Màu 10
    //             'rgb(128, 0, 128)',   // Màu 11
    //             'rgb(34, 193, 195)'   // Màu 12
    //         ],
    //         hoverOffset: 4,
    //     },
    //     ]
    // };


    return (
        <AdminLayout pageTitle="Trang chủ">
            {/* Nội dung của BodyAdmin cho HomeAdmin */}
            <h1>THỐNG KÊ</h1>
            <Row gutter={[10, 10]}>
                <Col span={20}>
                    <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Chọn bác sĩ"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={handleDoctorChange} // thêm cái này
                        options={dataDoctor.length > 0 ? dataDoctor.map(doctor => ({
                            value: doctor._id, // Sử dụng _id làm giá trị
                            label: `${doctor.lastName} ${doctor.firstName} - 
                            Phòng khám: ${doctor.phongKhamId.name} (${doctor.phongKhamId.address})
                            `,
                        })) : [{ value: '', label: 'Không có bác sĩ nào' }]} // Hiển thị thông báo nếu rỗng
                    />
                </Col>
                <Col span={4}>
                    <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="Chọn trạng thái"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        onChange={handleTrangThaiKham} // thêm cái này
                        options={[
                            { value: 'chokham', label: 'Chờ Khám' },
                            { value: 'dakham', label: 'Đã Khám' },
                        ]} // Hiển thị thông báo nếu rỗng
                    />
                </Col>
                <Col md={24}>
                    {dataIdDoctor && trangThaiKhamSelect ? <>
                        <p style={{ fontSize: "20px", color: "blue" }}>Số ca {trangThaiKhamSelect === "dakham" ? 'đã' : 'chưa'} khám là: {dataThongKe[0]?.totalCaKham}</p>
                    </> : ''}
                    {/* <Row style={{ height: '400px' }}>
                        <Col span={24} style={{ height: '400px', justifyItems: "flex-start", display: "flex" }}>
                            <Pie
                                style={{ justifyContent: "start", cursor: "pointer" }}
                                data={chartData}
                                options={{
                                    responsive: true,  // Đảm bảo biểu đồ phản hồi theo kích thước màn hình
                                    plugins: {
                                        legend: {
                                            position: 'top',  // Vị trí của legend
                                            labels: {
                                                font: {
                                                    size: 15  // Điều chỉnh kích thước font trong legend
                                                }
                                            }
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: (tooltipItem) => {
                                                    // console.log("tooltipItem: ",tooltipItem);                                                        
                                                    // const sales = Math.round(tooltipItem.raw).toLocaleString(); // Doanh thu
                                                    const totalOrders = dataThongKe[tooltipItem.dataIndex]?.totalCaKham || 0; // Số đơn hàng
                                                    return `Tổng ca: ${totalOrders}`; // Hiển thị doanh thu và số đơn hàng                                                        
                                                },
                                            },
                                            // Thay đổi kích thước font của label trong tooltip
                                            bodyFont: {
                                                size: 14,  // Kích thước chữ trong tooltip
                                            },
                                            titleFont: {
                                                size: 15,  // Kích thước chữ tiêu đề trong tooltip
                                            },
                                        },
                                    },
                                    maintainAspectRatio: false,  // Đảm bảo tỷ lệ không cố định
                                }}
                                width={170} height={170} />
                        </Col>
                    </Row> */}
                </Col>
            </Row>

        </AdminLayout>
    );
};
export default HomeAdmin;