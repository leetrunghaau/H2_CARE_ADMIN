import { Carousel, Col, Row } from "antd";
import "./bodyHomePage.scss";
import HinhTron from "../../../components/TrangChu/HinhTron/HinhTron";
import HinhChuNhat from "../../../components/TrangChu/HinhChuNhat/HinhChuNhat";
import HinhVuong from "../../../components/TrangChu/HinhVuong/Slider";
import HinhTronSlider from "../../../components/TrangChu/HinhVuong/HinhTronSlider";
import { useEffect, useState } from "react";
import {
  fetchAllChuyenKhoa,
  fetchAllDoctor,
  fetchAllPhongKham,
} from "../../../services/apiDoctor";
import { useNavigate } from "react-router-dom";

const BodyHomePage = () => {
  const [dataDoctor, setDataDoctor] = useState(null);
  const [dataPhongKham, setDataPhongKham] = useState(null);
  const [dataChuyenKhoa, setDataChuyenKhoa] = useState(null);
  const [loadingCard, setLoadingCard] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await listChuyenKhoa();
      await listDoctor();
      await listPhongKham();
    };

    fetchData();
  }, []);

  const listDoctor = async () => {
    const res = await fetchAllDoctor();
    if (res && res.data) {
      setDataDoctor(res.data);
    }
  };

  const listPhongKham = async () => {
    const res = await fetchAllPhongKham();
    if (res && res.data) {
      setDataPhongKham(res.data);
    }
  };

  const listChuyenKhoa = async () => {
    setLoadingCard(true);
    const res = await fetchAllChuyenKhoa();
    if (res && res.data) {
      setDataChuyenKhoa(res.data);
    }
    setLoadingCard(false);
  };

  // Mảng chứa các giá trị src và txtP
  const items = [
    {
      key: "0",
      src: "https://cdn.bookingcare.vn/fo/w384/2023/11/01/140234-bac-si.png",
      txtP: "Bác sĩ",
      navigate: "/user/bac-si-noi-bat",
    },
    {
      key: "1",
      src: "https://cdn.bookingcare.vn/fo/w384/2023/11/01/140537-chuyen-khoa.png",
      txtP: "Chuyên khoa",
      navigate: "/user/chuyen-khoa-kham",
    },
    // Thêm các đối tượng khác nếu cần
  ];

  const items_toandien = [
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161905-iconkham-chuyen-khoa.png&w=128&q=75",
      txtP: "Khám chuyên khoa",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161817-iconkham-tu-xa.png&w=128&q=75",
      txtP: "Khám từ xa",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161350-iconkham-tong-quan.png&w=128&q=75",
      txtP: "Khám tổng quát",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161340-iconxet-nghiem-y-hoc.png&w=128&q=75",
      txtP: "Xét nghiệm y học",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161403-iconsuc-khoe-tinh-than.png&w=128&q=75",
      txtP: "Sức khỏe tinh thần",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161410-iconkham-nha-khoa.png&w=128&q=75",
      txtP: "Khám nha khoa",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161421-icongoi-phau-thuat.png&w=128&q=75",
      txtP: "Gói phẫu thuật",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F09%2F20%2F145257-thiet-ke-chua-co-ten-3.png&w=128&q=75",
      txtP: "Sống khỏe Tiểu đường",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F06%2F07%2F161442-iconbai-test-suc-khoe2.png&w=128&q=75",
      txtP: "Bài Test Sức khỏe",
    },
    {
      src: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F07%2F06%2F163421-153524-near-home-01.png&w=128&q=75",
      txtP: "Y tế gần bạn",
    },
  ];

  const items_ChuyenKhoa = dataChuyenKhoa
    ? dataChuyenKhoa.map((chuyenKhoa) => ({
        id: chuyenKhoa._id, // Thêm _id vào đây
        src: `${import.meta.env.VITE_BACKEND_URL}/uploads/${chuyenKhoa?.image}`,
        txtP: `${chuyenKhoa?.name}`,
        txtAddress: ``,
      }))
    : [];

  const items_PhongKham = dataPhongKham
    ? dataPhongKham.map((phongKham) => ({
        src: `${import.meta.env.VITE_BACKEND_URL}/uploads/${phongKham?.image}`,
        txtP: `${phongKham?.name}`,
        txtAddress: `${phongKham?.address}`,
      }))
    : [];

  const items_BacSiNoiBat = dataDoctor
    ? dataDoctor.map((doctor) => ({
        id: doctor._id, // Thêm _id vào đây
        src: `${import.meta.env.VITE_BACKEND_URL}/uploads/${doctor?.image}`,
        txtP: `${doctor?.chucVuId.map((chucVu) => chucVu?.name).join(", ")}
                , ${doctor?.lastName} ${doctor?.firstName}`,
        txtB: `${doctor?.chuyenKhoaId
          .map((chuyenKhoa) => chuyenKhoa.name)
          .join(", ")}`,
      }))
    : [];

  const handleRedirectDoctor = (item) => {
    navigate(`/view-doctor?id=${item}`);
  };

  const handleRedirectChuyenKhoa = (item) => {
    navigate(`/user/view-chuyen-khoa-kham?idChuyenKhoa=${item}`);
  };

  return (
    <>
      <Row className="body-top">
        <div style={{ position: "relative", width: "75%", margin: "2px auto" }}>
          <Carousel
            className="custom-carousel"
            autoplay
            draggable={true}
            arrows={true}>
            <div>
              <img
                width={"100%"}
                height={350}
                style={{ borderRadius: "20px" }}
                src="https://cdn.bookingcare.vn/fo/w1920/2023/10/10/163557-dat-lich-cham-soc-wecare247.png"
                alt=""
              />
            </div>
            <div>
              <img
                width={"100%"}
                height={350}
                style={{ borderRadius: "20px" }}
                src="https://cdn.bookingcare.vn/fo/w1920/2023/09/07/141422-144204-dat-lich-kham-bookingcare-pharmacity.jpg"
                alt=""
              />
            </div>
            <div>
              <img
                width={"100%"}
                height={350}
                style={{ borderRadius: "20px" }}
                src="https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2024%2F03%2F15%2F094346-hoi-dap-cong-dong.png&w=1920&q=75"
                alt=""
              />
            </div>
            <div>
              <img
                width={"100%"}
                height={350}
                style={{ borderRadius: "20px" }}
                src="https://cdn.bookingcare.vn/fo/w1920/2023/10/10/163557-dat-lich-cham-soc-wecare247.png"
                alt=""
              />
            </div>
            <div>
              <img
                width={"100%"}
                height={350}
                style={{ borderRadius: "20px" }}
                src="https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2023%2F11%2F02%2F134537-group-12314.png&w=1920&q=75"
                alt=""
              />
            </div>
          </Carousel>
        </div>
      </Row>

      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <span
            style={{
              fontWeight: "500",
              fontSize: "4vh",
              width: "100%",
              padding: "4vh 0",
            }}>
            Dành cho bạn
          </span>
          {items.map((item, index) => (
            <Col key={index} md={6} sm={10} xs={24} className="cot-ben-trong">
              <HinhTron
                src={item.src}
                txtP={item.txtP}
                redirectChuyenKhoa={item.navigate}
              />
            </Col>
          ))}
        </Row>
      </div>

      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <span
            style={{
              fontWeight: "500",
              fontSize: "4vh",
              width: "100%",
              padding: "4vh 0",
            }}>
            Dịch vụ toàn diện
          </span>
          {items_toandien.map((item, index) => (
            <Col
              key={index}
              md={12}
              sm={24}
              xs={24}
              style={{ marginBottom: "5vh" }}>
              <HinhChuNhat src={item.src} txtP={item.txtP} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <span
              style={{ fontWeight: "500", fontSize: "4vh", padding: "4vh 0" }}>
              Chuyên khoa
            </span>
            <span
              style={{
                fontWeight: "500",
                fontSize: "3vh",
                backgroundColor: "blue",
                height: "50px",
                lineHeight: "45px",
                borderRadius: "15px",
                textAlign: "center",
                backgroundColor: "#d0edf7",
                color: "rgb(45 145 179)",
                marginTop: "10px",
                cursor: "pointer",
                padding: "3px 10px",
              }}
              onClick={() => navigate("/user/chuyen-khoa-kham")}>
              Xem thêm
            </span>
          </div>
          <HinhVuong
            items={items_ChuyenKhoa}
            width={300}
            height={250}
            loadingCard={loadingCard}
            urlDoctor={handleRedirectChuyenKhoa}
          />
        </Row>
      </div>

      <div className="danh-cho-ban" style={{ margin: "30px 0" }}>
        <Row className="ben-trong">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <span
              style={{ fontWeight: "500", fontSize: "4vh", padding: "4vh 0" }}>
              Cơ sở y tế
            </span>
            <span
              style={{
                fontWeight: "500",
                fontSize: "3vh",
                backgroundColor: "blue",
                height: "50px",
                lineHeight: "45px",
                borderRadius: "15px",
                textAlign: "center",
                backgroundColor: "#d0edf7",
                color: "rgb(45 145 179)",
                marginTop: "10px",
                padding: "3px 10px",
              }}
              onClick={() => navigate("/user/phong-kham")}>
              Xem thêm
            </span>
          </div>
          <HinhVuong
            items={items_PhongKham}
            width={300}
            height={200}
            loadingCard={loadingCard}
          />
        </Row>
      </div>

      <Row
        className="ben-trong"
        style={{
          backgroundImage:
            "url('https://cdn.bookingcare.vn/fo/2023/11/01/140311-background5.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          marginBottom: "20px",
        }}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}>
          <span
            style={{ fontWeight: "500", fontSize: "4vh", padding: "4vh 22vh" }}>
            Bác sĩ nổi bật
          </span>
          <span
            style={{
              fontWeight: "500",
              fontSize: "3vh",
              backgroundColor: "blue",
              height: "50px",
              lineHeight: "45px",
              borderRadius: "15px",
              textAlign: "center",
              backgroundColor: "#d0edf7",
              color: "rgb(45 145 179)",
              margin: "3vh 22vh",
              cursor: "pointer",
              padding: "3px 10px",
            }}
            onClick={() => navigate("/user/bac-si-noi-bat")}>
            Xem thêm
          </span>
        </div>
        <div
          style={{
            backgroundColor: "transparent",
            width: "77%",
            height: "100%",
            position: "relative",
            left: "24vh",
          }}>
          <HinhTronSlider
            items={items_BacSiNoiBat}
            urlDoctor={handleRedirectDoctor}
          />
        </div>
      </Row>

      <div className="danh-cho-ban" style={{ margin: "30px 0" }}>
        <Row className="ben-trong">
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}>
            <span
              style={{ fontWeight: "500", fontSize: "4vh", padding: "4vh 0" }}>
              Khám từ xa
            </span>
            <span
              style={{
                fontWeight: "500",
                fontSize: "3vh",
                backgroundColor: "blue",
                height: "50px",
                lineHeight: "45px",
                borderRadius: "15px",
                textAlign: "center",
                backgroundColor: "#d0edf7",
                color: "rgb(45 145 179)",
                marginTop: "10px",
                padding: "3px 10px",
              }}>
              Xem thêm
            </span>
          </div>
          <HinhVuong
            items={items_PhongKham}
            width={300}
            height={200}
            loadingCard={loadingCard}
          />
        </Row>
      </div>

      <div className="danh-cho-ban">
        <Row className="ben-trong">
          <span
            style={{
              fontWeight: "500",
              fontSize: "4vh",
              width: "100%",
              padding: "4vh 0",
            }}>
            Gợi ý của BookingCare
          </span>
          {items.map((item, index) => (
            <Col key={index} md={6} sm={10} xs={24} className="cot-ben-trong">
              <HinhTron src={item.src} txtP={item.txtP} />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};
export default BodyHomePage;
