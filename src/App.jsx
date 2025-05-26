import { Routes, Route } from "react-router-dom";
import Login from "./pages/Admin/Login";
import Register from "./pages/Admin/Register";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import QuanLyDoctor from "./components/Admin/Doctor/QuanLyDoctor";
import QuanLyChucVu from "./components/Admin/ChucVu/QuanLyChucVu";
import QuanLyPhongKham from "./components/Admin/PhongKham/QuanLyPhongKham";
import QuanLyChuyenKhoa from "./components/Admin/ChuyenKhoa/QuanLyChuyenKhoa";
import KeHoachKhamBenh from "./components/Admin/KeHoachKhamBenh/KeHoachKhamBenh";
import QuanLyLichHen from "./components/Admin/LichHen/QuanLyLichHen";
import QuanLyKhachHang from "./components/Admin/BenhNhan/QuanLyKhachHang";

const App = () => {
  const routeConfig = [
    { path: "/admin/home-page-admin", element: <HomeAdmin /> }, // home page admin
    { path: "/admin/login-admin", element: <Login /> }, // Login admin
    { path: "/admin/register-admin", element: <Register /> }, // Register admin
    { path: "/admin/quan-ly-doctor", element: <QuanLyDoctor /> }, // quan ly doctor
    { path: "/admin/quan-ly-chuc-vu", element: <QuanLyChucVu /> }, // quan ly chuc vu
    { path: "/admin/quan-ly-phong-kham", element: <QuanLyPhongKham /> }, // quan ly phong kham
    { path: "/admin/quan-ly-chuyen-khoa", element: <QuanLyChuyenKhoa /> }, // quan ly chuyen khoa
    { path: "/admin/ke-hoach-doctor", element: <KeHoachKhamBenh /> }, // ke hoach kham benh
    { path: "/admin/quan-ly-lich-hen", element: <QuanLyLichHen /> }, // ke hoach kham benh
    { path: "/admin/quan-ly-kh", element: <QuanLyKhachHang /> }, // ke hoach kham benh
  ];
  return (
    <>
      <Routes>
        {routeConfig.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  );
};

export default App;
