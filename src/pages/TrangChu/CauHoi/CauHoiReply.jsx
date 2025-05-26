import { Avatar, Button, Col, Divider, Row, Select } from "antd"
import Footer from "../../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../../components/TrangChu/Header/HeaderViewDoctor"
import { IoHomeSharp } from "react-icons/io5"
import { UserOutlined } from "@ant-design/icons"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchAllChuyenKhoa, getAllCauHoi } from "../../../services/apiDoctor"
import ModalCauHoi from "../../../components/TrangChu/ModalDoiMK/ModalCauHoi"



const CauHoiReply = () => {

    const [dataAllCauHoi, setDataAllCauHoi] = useState([])
    const navigate = useNavigate()
    const [itemsToShow, setItemsToShow] = useState(3); // Mặc định sẽ hiển thị 3 câu hỏi
    const [dataChuyenKhoa, setDataChuyenKhoa] = useState([])   
    const [selectedLocTheoChuyenKhoa, setSelectedLocTheoChuyenKhoa] = useState([]);
    const [openModalCauHoi, setOpenModalCauHoi] = useState(false);
    
    useEffect(() => {
        fetchListCauHoi()
    }, [selectedLocTheoChuyenKhoa])

    useEffect(() => {
        fetchAllChuyenKhoaDoctor()
    }, [])

    const fetchListCauHoi = async () => {

        let query = ''
        if (selectedLocTheoChuyenKhoa && selectedLocTheoChuyenKhoa.length > 0) {
            query += `&locTheoChuyenKhoa=${encodeURIComponent(JSON.stringify(selectedLocTheoChuyenKhoa))}`;
        }
        const res = await getAllCauHoi(query)
        console.log("res all cauhoi: ", res);
        if(res && res.data) {
            setDataAllCauHoi(res.data)
        }
    }

    const fetchAllChuyenKhoaDoctor = async () => {
        let query = `page=1&limit=1000`
        let res = await fetchAllChuyenKhoa(query)
        if(res && res.data) {
            setDataChuyenKhoa(res.data)
        }
    }

    // Hàm xử lý khi nhấn nút "Xem thêm"
    const handleLoadMore = () => {
        setItemsToShow(itemsToShow + 3); // Tăng thêm 3 câu hỏi
    };

    const onChangeTheoChuyenKhoa = (e) => {
        console.log("e: ", e);
        setSelectedLocTheoChuyenKhoa(e)
    };
   
    return (
        <>
        <HeaderViewDoctor />
        <Row>
            <Col span={18} className="col-body" >
                <Row gutter={[20,30]}>
                   
                    <Col span={24}>
                        <p className="txt-title"><IoHomeSharp /> / Hỏi đáp</p>                        
                    </Col>
                    <Col span={12}>
                        <Button size="large" type="primary" style={{width: "100%"}} onClick={() => setOpenModalCauHoi(true)}>Đặt câu hỏi</Button>
                    </Col>
                    <Col span={12}>
                    <div style={{alignItems: "center", display: "flex"}}>
                        <Select
                            size="large"
                            showSearch
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="Danh mục câu hỏi"
                            optionFilterProp="label"
                            value={selectedLocTheoChuyenKhoa}
                            onChange={(e) => onChangeTheoChuyenKhoa(e)}
                            filterSort={(optionA, optionB) =>
                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={dataChuyenKhoa.map(chuyenKhoa => ({
                                value: chuyenKhoa._id, // Sử dụng _id làm giá trị
                                label: `${chuyenKhoa.name}`, // Hiển thị name và address
                            }))}
                        />  
                    </div>
                    </Col>  

                    {dataAllCauHoi?.length > 0 ? dataAllCauHoi.slice(0, itemsToShow).map(item => {
                        return (
                            <Col span={24}>
                                <div style={{borderRadius: "10px", border: "1px solid rgb(219, 216, 216)", fontSize: "20px", lineHeight: "0.3",
                                    display: "flex", padding: "0 15px 25px 20px", flexDirection: "column"}}>
                                    <p style={{fontWeight: "500"}}>Câu hỏi:</p>
                                    <span style={{lineHeight: "1.5"}}>{item?.cauHoi}</span>
                                    <Divider style={{marginTop: "10px"}}/>
                                    <p style={{marginTop: "-4px", fontWeight: "500"}}>Trả lời:</p>   
                                
                                    <div style={{
                                        display: "flex", 
                                        alignItems: "center", 
                                        flexWrap: "wrap", 
                                        marginTop: "10px"
                                    }}>
                                        <Avatar style={{border: "1px solid green"}} src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item?.doctors.image}`}  size={64} icon={<UserOutlined />} />                            
                                        <div style={{display: "flex", flexDirection: "column", padding: "0 15px", lineHeight: "15px"}}>
                                            <span>Được trả lời bởi:</span> <br/>
                                            <span style={{color: "rgb(69, 195, 210)", lineHeight: "1.5"}}>
                                                {item?.doctors.chucVuId.map(item => item?.name).join(', ')} - &nbsp;
                                                <span>{item?.doctors.lastName} {item?.doctors.firstName}</span>
                                            </span>
                                        </div>                                                                        
                                    </div>

                                    <div style={{paddingTop: "25px", lineHeight: "1.5"}}>
                                        <span>{item?.cauTraLoi}</span>
                                    </div>
                                </div>                        
                            </Col>                                                  
                        )
                    }) : <>
                        <Col span={24}>
                        <p>chưa có data</p>
                        </Col>
                    </>}

                    {dataAllCauHoi?.length > itemsToShow && (
                        <Col span={24} style={{ textAlign: 'center', marginTop: '20px' }}>
                            <Button onClick={handleLoadMore}>Xem thêm</Button>
                        </Col>
                    )}

                    <ModalCauHoi
                        openModalCauHoi={openModalCauHoi}
                        setOpenModalCauHoi={setOpenModalCauHoi}
                    />       
                </Row>
            </Col>
        </Row>
        <Footer/>
        </>
    )
}
export default CauHoiReply