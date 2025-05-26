import { Avatar, Button, Col, Row, Input } from "antd"
import Footer from "../../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../../components/TrangChu/Header/HeaderViewDoctor"
import '../LichHen/lichhen.scss'
import { IoHomeSharp } from "react-icons/io5"
import { UserOutlined } from "@ant-design/icons"
import { MdAccessTimeFilled } from "react-icons/md"
import { BsCalendar2Date } from "react-icons/bs"
import { useEffect, useState } from "react"
import { fetchAllDoctor } from "../../../services/apiDoctor"
import { useNavigate } from "react-router-dom"
import SearchComponent from "../../../components/TrangChu/SearchComponent/SearchComponent"
const { Search } = Input;


const BacSiNoiBat = () => {

    const [dataAllDoctor, setDataAllDoctor] = useState([])    
    const [dataSearch, setDataSearch] = useState('')

    const navigate = useNavigate()
    
    useEffect(() => {
        fetchListDoctor()
    }, [dataSearch])

    const fetchListDoctor = async () => {

        let query = 'page=1&limit=1000'
        if (dataSearch) {
            query += `&firstName=${encodeURIComponent(dataSearch)}`;
        }
        if (dataSearch) {
            query += `&lastName=${encodeURIComponent(dataSearch)}`;
        }
        const res = await fetchAllDoctor(query)
        console.log("res all doctor: ", res);
        if(res && res.data) {
            setDataAllDoctor(res.data)
        }
    }

    const handleRedirectDoctor = (item) => {
        navigate(`/view-doctor?id=${item}`)
    }

    const onSearch = (value) => {
        console.log("Giá trị tìm kiếm:", value); // Thêm log này
    
        setDataSearch(value || '');
    };

    return (
        <>
        <HeaderViewDoctor />
        <Row>
            <Col span={18} className="col-body">
                <Row>
                    <Col span={24}>
                        <p className="txt-title"><IoHomeSharp /> / Bác sĩ nổi bật</p>
                        {/* <Divider/> */}
                        {/* <hr style={{border: "1px solid rgb(243, 243, 243)"}} /> */}
                    </Col>
                    <Col span={24}>
                        <p className="title-lichhen">Bác sĩ nổi bật
                        </p>
                    </Col>   
                    <Col span={24} style={{marginBottom: "20px"}}>
                        <SearchComponent placeholder="Tìm kiếm tên bác sĩ" onSearch={onSearch}/>
                    </Col>                  

                    {dataAllDoctor?.length > 0 ? (
                        dataAllDoctor.map((item, index) => (
                            <Col key={index} span={24} style={{ padding: "10px 15px 0", cursor: "pointer" }} onClick={() => handleRedirectDoctor(item._id)}>
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
                                            {item ? item.chucVuId.map(item => item?.name).join(', ') : ''} - &nbsp;
                                            <span style={{color: "navy"}}>{item?.lastName} {item?.firstName}</span>
                                        </span> <br />
                                        <span className="title-nho">
                                            {item ? item.chuyenKhoaId.map(item => item?.name).join(', ') : ''}
                                        </span>
                                    </Col>
                                </Row>
                                <hr style={{ border: "1px solid rgb(243, 243, 243)" }} />
                            </Col>
                        ))
                    ) : (
                        <Col span={24} style={{ textAlign: "center", padding: "20px" }}>
                            <p style={{ color: "gray", fontSize: "18px" }}>Chưa có bác sĩ nào.</p>
                        </Col>
                    )}                    
                    
                </Row>
            </Col>
        </Row>
        <Footer/>
        </>
    )
}
export default BacSiNoiBat