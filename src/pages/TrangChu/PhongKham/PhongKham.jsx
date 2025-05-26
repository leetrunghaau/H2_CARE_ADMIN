import { Avatar, Col, Row } from "antd"
import Footer from "../../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../../components/TrangChu/Header/HeaderViewDoctor"
import '../LichHen/lichhen.scss'
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAllPhongKham } from "../../../services/apiDoctor"
import { IoHomeSharp } from "react-icons/io5"
import { UserOutlined } from "@ant-design/icons"
import SearchComponent from "../../../components/TrangChu/SearchComponent/SearchComponent"

const PhongKham = () => {

    const [dataPK, setDataPK] = useState([])
    const navigate = useNavigate()
    const [dataSearch, setDataSearch] = useState('')

    useEffect(() => {
        fetchListPK()
    }, [dataSearch])

    const fetchListPK = async () => {

        let query = 'page=1&limit=1000'
        if (dataSearch) {
            query += `&name=${encodeURIComponent(dataSearch)}`;
        }
        if (dataSearch) {
            query += `&address=${encodeURIComponent(dataSearch)}`;
        }
        const res = await fetchAllPhongKham(query)
        console.log("res all doctor: ", res);
        if(res && res.data) {
            setDataPK(res.data)
        }
    }

    const onSearch = (value) => {
        console.log("Giá trị tìm kiếm:", value); // Thêm log này
    
        setDataSearch(value || '');
    };

    const handleRedirectPK = (item) => {
        navigate(`/user/view-phong-kham?idPhongKham=${item}`)
    }

    return (
        <>
        <HeaderViewDoctor />
        <Row>
            <Col span={18} className="col-body">
                <Row>
                    <Col span={24}>
                        <p className="txt-title"><IoHomeSharp /> / Phòng khám</p>
                        {/* <Divider/> */}
                        {/* <hr style={{border: "1px solid rgb(243, 243, 243)"}} /> */}
                    </Col>
                    <Col span={24}>
                        <p className="title-lichhen"> Phòng khám</p>
                    </Col>  
                    <Col span={24} style={{marginBottom: "20px"}}>
                        <SearchComponent placeholder="Tìm kiếm tên, địa chỉ phòng khám" onSearch={onSearch}/>
                    </Col>   

                    {dataPK?.length > 0 ? (
                        dataPK.map((item, index) => (
                            <Col key={index} span={24} style={{ padding: "10px 15px 0", cursor: "pointer" }} onClick={() => handleRedirectPK(item._id)}>
                                <Row>
                                    <Col span={3}>
                                        <Avatar  
                                        style={{border: "1px solid green"}}
                                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item?.image}`} 
                                        shape="square" 
                                        size={120} 
                                        icon={<UserOutlined />} />
                                    </Col>
                                    <Col span={21} className="box-title-doctor">
                                        <span className="txt-Title-doctor-noi-bat">
                                            {item.name}
                                        </span> <br />      
                                        <p style={{color: "gray"}}>{item.address}</p>                                 
                                    </Col>
                                </Row>
                                <hr style={{ border: "1px solid rgb(243, 243, 243)" }} />
                            </Col>
                        ))
                    ) : (
                        <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
                            <p style={{ color: "gray", fontSize: "18px" }}>Chưa có chuyên khoa khám nào.</p>
                        </Col>
                    )}                    
                    
                </Row>
            </Col>
        </Row>
        <Footer/>
        </>
    )
}
export default PhongKham