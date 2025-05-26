import { Col, Row } from "antd"
import { Input, Space } from 'antd';
import SearchComponent from "./SearchComponent";
const { Search } = Input;
const BodyAdmin = ({ content, pageTitle, placeholder,
                    setFirstName, setLastName, setAddress,
                    setTenChucVu,
                    setTenPK, setAddressPK,
                    setTenCK, setLichHen                   
                 }) => {

    const onSearch = (value) => {
        console.log("Giá trị tìm kiếm:", value); // Thêm log này
        const [firstName, lastName, address, tenChucVu] = value.split(' ');
    
        // Log các giá trị đã tách ra
        console.log("firstName:", firstName);
        console.log("lastName:", lastName);
        console.log("address:", address);
        console.log("tenChucVu:", tenChucVu);
    
        setFirstName(value || '');
        setLastName(value || '');
        setAddress(value || '');
        setTenChucVu(value || '');
        setTenPK(value || '');
        setAddressPK(value || '');
        setTenCK(value || '');
        setLichHen(value || '');
    };
    

    return (
        <>
            <Row>
                <Col span={6} offset={5} style={{ marginTop: "5vh", textAlign: "start"}}>
                    <p style={{fontSize: "18px"}}>Home / {pageTitle}</p>
                </Col>
                <Col span={5} offset={7} style={{ marginTop: "8vh", height: "50px"}}>
                    {/* <Search placeholder="Tìm kiếm ở đây..." onSearch={onSearch} enterButton /> */}
                    <SearchComponent onSearch={onSearch} placeholder={placeholder} /> {/* Sử dụng component tìm kiếm */}
                </Col>
            </Row>

            <Row>
                <Col xs={18} md={18} span={18} offset={5} style={{
                    backgroundColor: "white",
                    marginTop: "50px",
                    marginBottom: "50px",
                    borderRadius: "15px", 
                    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Thêm viền mờ
                    backdropFilter: "blur(10px)", // Thêm hiệu ứng mờ
                    padding: "20px"
                    
                }}>
                {content} {/* Hiển thị nội dung từ props */}
                </Col>
            </Row>
        </>
    )
}

export default BodyAdmin