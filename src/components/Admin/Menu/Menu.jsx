import { FieldTimeOutlined, HomeOutlined, HomeTwoTone, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, message } from 'antd';
import { useEffect, useState } from 'react';
import { FaCircleInfo, FaRankingStar, FaUserDoctor } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { callLogout } from '../../../services/api';
import { IoIosPaperPlane } from 'react-icons/io';
import { MdOutlineLocalFireDepartment, MdOutlineMeetingRoom, MdOutlineRoom } from 'react-icons/md';

const MenuNav = (props) => {

    const [theme, setTheme] = useState('light');
    const [current, setCurrent] = useState('1');
    const [userLastName, setUserLastName] = useState('');
    const [userFirstName, setUserFirstName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const lastName = localStorage.getItem("lastName");
        const firstName = localStorage.getItem("firstName");
        if (lastName) {
            setUserLastName(lastName);
        }
        if (firstName) {
            setUserFirstName(firstName);
        }
    }, []);
    
    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        try {
            const res = await callLogout();
            localStorage.removeItem('access_token');

            if (res) {
                message.success("Đăng xuất thành công!");
                navigate("/admin/login-admin");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi đăng xuất', error);
            message.error("Đăng xuất không thành công!");
        }
    }

    const items = [
        {
            key: 'logo-web',
            label: <p style={{fontWeight: "500", fontSize: "18px"}}>ADMIN H2CARE</p>,   
            style: { pointerEvents: "none", userSelect: "none" }     
        },
        {
            key: '/admin/home-page-admin',
            label: <Link style={{fontSize: "17px"}} to={"/admin/home-page-admin"}>Trang chủ</Link>,
            icon: <HomeOutlined />,    
        },
        {
            key: 'doctor',
            label: <label style={{fontSize: "17px"}}>Quản lý bác sĩ</label>,
            icon: <FaUserDoctor />,
            children: [
                {
                    key: '/admin/quan-ly-doctor',
                    label: <Link style={{fontSize: "17px"}} to="/admin/quan-ly-doctor">Thông tin bác sĩ</Link>,
                    icon: <FaCircleInfo />
                },
                {
                    key: '/admin/ke-hoach-doctor',
                    label: <Link style={{fontSize: "17px"}} to="/admin/ke-hoach-doctor">Kế hoạch khám bệnh của bác sĩ</Link>,
                    icon: <IoIosPaperPlane />
                },                
            ],
        },
        {
            key: 'pk',
            label: <label style={{fontSize: "17px"}}>Quản lý Y Tế</label>,
            icon: <MdOutlineMeetingRoom size={18} /> ,
            children: [
                {
                    key: '/admin/quan-ly-phong-kham',
                    label: <Link style={{fontSize: "17px"}} to="/admin/quan-ly-phong-kham">Phòng khám</Link>,
                    icon: <MdOutlineRoom size={20} />
                },
                {
                    key: '/admin/quan-ly-chuc-vu',
                    label: <Link style={{fontSize: "17px"}} to="/admin/quan-ly-chuc-vu">Chức vụ</Link>,
                    icon: <FaRankingStar size={20} />
                }, 
                {
                    key: '/admin/quan-ly-chuyen-khoa',
                    label: <Link style={{fontSize: "17px"}} to="/admin/quan-ly-chuyen-khoa">Chuyên khoa</Link>,
                    icon: <MdOutlineLocalFireDepartment size={20} />
                },                
            ],
        },
        {
            key: '/admin/quan-ly-lich-hen',
            label: <Link style={{fontSize: "17px"}} to="/admin/quan-ly-lich-hen">Lịch hẹn</Link>,     
            icon: <FieldTimeOutlined size={20}/>,    
        },
        {
            key: '/admin/quan-ly-kh',
            label: <Link style={{fontSize: "17px"}} to="/admin/quan-ly-kh">Quản lý khách hàng</Link>,     
            icon: <FaUserDoctor />,    
        },
        {
            key: 'acc-web',
            label: <p style={{fontWeight: "500", fontSize: "18px" }}>Tài khoản trang</p>,      
            style: { pointerEvents: "none", userSelect: "none" }     
        },
        {
            key: 'acc-ad',
            label: (
                <p style={{fontSize: "17px"}}>
                    Xin chào <span style={{color: "red", fontWeight: "500", marginLeft: "5px"}}>{userLastName} {userFirstName}</span>
                </p>
            ),
            icon: <UserOutlined />,
            style: { pointerEvents: "none", userSelect: "none" }          
        },
        {
            key: 'logout',
            label: <Link style={{fontSize: "17px"}} onClick={() => handleLogout()}>Đăng xuất</Link>,     
            icon: <LogoutOutlined />,    
        },
        {
            key: 'home-web',
            label: <Link style={{fontSize: "17px"}} to={"/"}>Về trang chủ chính</Link>,     
            icon: <HomeTwoTone />,    
        },
    ];

    return (
        <>
        <Menu
        theme={theme}
        onClick={onClick}
        style={{
            width: 270,
            // height: 1000,
            height: 'calc(100vh - 64px)', // Chiều cao menu bằng chiều cao viewport trừ chiều cao tiêu đề
            borderRadius: "20px", 
            marginLeft: "30px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Thêm viền mờ
            backdropFilter: "blur(10px)", // Thêm hiệu ứng mờ
            position: "fixed", // Dán menu ở vị trí cố định
            top: '30px', // Đặt menu ngay dưới tiêu đề
            
        }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[location.pathname]} // Đặt selectedKeys dựa trên đường dẫn hiện tại
        mode="inline"
        items={items}
      />
        </>
    )
}

export default MenuNav