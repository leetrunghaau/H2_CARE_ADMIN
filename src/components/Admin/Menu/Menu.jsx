import {
  FieldTimeOutlined,
  HomeOutlined,
  HomeTwoTone,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd";
import { useEffect, useState } from "react";
import { FaCircleInfo, FaRankingStar, FaUserDoctor } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { callLogout } from "../../../services/api";
import { IoIosPaperPlane } from "react-icons/io";
import {
  MdOutlineLocalFireDepartment,
  MdOutlineMeetingRoom,
  MdOutlineRoom,
} from "react-icons/md";

const MenuNav = () => {
  const [theme, setTheme] = useState("light");
  const [current, setCurrent] = useState("1");
  const [userLastName, setUserLastName] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
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
    console.log("click ", e);
    setCurrent(e.key);
  };

  const handleLogout = async () => {
    try {
      const res = await callLogout();
      localStorage.removeItem("access_token");

      if (res) {
        message.success("Đăng xuất thành công!");
        navigate("/admin/login-admin");
      }
    } catch (error) {
      console.error("Có lỗi xảy ra khi đăng xuất", error);
      message.error("Đăng xuất không thành công!");
    }
  };

  const items = [
    {
      key: "logo-web",
      label: (
        <p style={{ fontWeight: "800", fontSize: "100%" }}>ADMIN H2CARE</p>
      ),
      style: { pointerEvents: "none", userSelect: "none" },
    },
    {
      key: "/admin/home-page-admin",
      label: (
        <Link class="fs-2" to={"/admin/home-page-admin"}>
          Trang chủ
        </Link>
      ),
      icon: <HomeOutlined />,
    },
    {
      key: "doctor",
      label: <label class="fs-2">Quản lý bác sĩ</label>,
      icon: <FaUserDoctor />,
      children: [
        {
          key: "/admin/quan-ly-doctor",
          label: (
            <Link class="fs-2" to="/admin/quan-ly-doctor">
              Thông tin bác sĩ
            </Link>
          ),
          icon: <FaCircleInfo />,
        },
        {
          key: "/admin/ke-hoach-doctor",
          label: (
            <Link class="fs-2" to="/admin/ke-hoach-doctor">
              Kế hoạch khám bệnh của bác sĩ
            </Link>
          ),
          icon: <IoIosPaperPlane />,
        },
      ],
    },
    {
      key: "pk",
      label: <label class="fs-2">Quản lý Y Tế</label>,
      icon: <MdOutlineMeetingRoom size={18} />,
      children: [
        {
          key: "/admin/quan-ly-phong-kham",
          label: (
            <Link class="fs-2" to="/admin/quan-ly-phong-kham">
              Phòng khám
            </Link>
          ),
          icon: <MdOutlineRoom size={20} />,
        },
        {
          key: "/admin/quan-ly-chuc-vu",
          label: (
            <Link class="fs-2" to="/admin/quan-ly-chuc-vu">
              Chức vụ
            </Link>
          ),
          icon: <FaRankingStar size={20} />,
        },
        {
          key: "/admin/quan-ly-chuyen-khoa",
          label: (
            <Link class="fs-2" to="/admin/quan-ly-chuyen-khoa">
              Chuyên khoa
            </Link>
          ),
          icon: <MdOutlineLocalFireDepartment size={20} />,
        },
      ],
    },
    {
      key: "/admin/quan-ly-lich-hen",
      label: (
        <Link class="fs-2" to="/admin/quan-ly-lich-hen">
          Lịch hẹn
        </Link>
      ),
      icon: <FieldTimeOutlined size={20} />,
    },
    {
      key: "/admin/quan-ly-kh",
      label: (
        <Link class="fs-2" to="/admin/quan-ly-kh">
          Quản lý khách hàng
        </Link>
      ),
      icon: <FaUserDoctor />,
    },
    {
      key: "acc-web",
      label: (
        <p style={{ fontWeight: "800", fontSize: "100%" }}>Tài khoản trang</p>
      ),
      style: { pointerEvents: "none", userSelect: "none" },
    },
    {
      key: "acc-ad",
      label: (
        <p class="fs-2">
          Xin chào{" "}
          <span style={{ color: "red", fontWeight: "500", marginLeft: "5px" }}>
            {userLastName} {userFirstName}
          </span>
        </p>
      ),
      icon: <UserOutlined />,
      style: { pointerEvents: "none", userSelect: "none" },
    },
    {
      key: "logout",
      label: (
        <Link class="fs-2" onClick={() => handleLogout()}>
          Đăng xuất
        </Link>
      ),
      icon: <LogoutOutlined />,
    },
    {
      key: "home-web",
      label: (
        <Link class="fs-2" to={"/"}>
          Về trang chủ chính
        </Link>
      ),
      icon: <HomeTwoTone />,
    },
  ];

  return (
    <>
      <Menu
        theme={theme}
        onClick={onClick}
        style={{
          width: 220,
          height: "calc(100vh - 64px)",
          borderRadius: "20px",
          marginLeft: "30px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          position: "fixed",
          top: "30px",
        }}
        defaultOpenKeys={["sub1"]}
        selectedKeys={[location.pathname]}
        mode="inline"
        items={items}
      />
    </>
  );
};

export default MenuNav;
