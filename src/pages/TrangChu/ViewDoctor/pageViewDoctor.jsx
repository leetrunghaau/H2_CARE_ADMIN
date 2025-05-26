import { Avatar, Button, Col, Divider, Drawer, Row } from 'antd'
import Footer from '../../../components/TrangChu/Footer/Footer'
import HeaderViewDoctor from '../../../components/TrangChu/Header/HeaderViewDoctor'
import './pageViewDoctor.scss'
import {  CaretRightOutlined, DownOutlined, HomeOutlined, LikeFilled, PhoneOutlined, UserOutlined } from '@ant-design/icons'
import { FaLocationDot, FaRegHandPointUp } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import { FaChevronRight, FaRegCalendarAlt } from 'react-icons/fa'
import { IoIosShareAlt } from 'react-icons/io'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchDoctorById, fetchDoctorByNgayGio, getTimeSlotsByDoctorAndDate } from '../../../services/apiDoctor'
import moment from 'moment'

 
const PageViewDoctor = () => {

    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('top');
    const [showDetails, setShowDetails] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null); // State để theo dõi index của thẻ đang hover
    const [selectedDate, setSelectedDate] = useState(''); // State để lưu ngày đã chọn 

    const [hienThiTime, setHienThiTime] = useState('Bấm vào đây để xem lịch khám!'); // State để lưu ngày đã chọn  
    console.log("hienThiTime: ",hienThiTime);
      
    const navigate = useNavigate()

    const [selectedTimeId, setSelectedTimeId] = useState(null); 

    const [timeGioList, setTimeGioList] = useState([]);    

    console.log("timeGioList: ", timeGioList);
    

    let location = useLocation();
    const [dataDoctor, setDataDoctor] = useState();    

    // Phân tích cú pháp query string
    let params = new URLSearchParams(location.search);
    const id = params.get("id"); // Lấy giá trị của tham số "id"

    console.log("check id: ", id);

    useEffect(() => {
        fetchADoctorById(id);
    }, [id]);

    useEffect(() => {
        const fetchDoctorTimes = async () => {
            
            const doctorId = id
            const appointmentDate = selectedTimeId 
            if (!appointmentDate) return; // Kiểm tra nếu appointmentDate đã được chọn
            let query = `doctorId=${doctorId}&date=${appointmentDate}`

            const res = await getTimeSlotsByDoctorAndDate(query);
            console.log("res fetch: ", res);
            
            if (res && res.timeGioList) {                    
                setTimeGioList(res.timeGioList)         
            } else {
                // Xử lý lỗi nếu cần
                console.error('Error fetching time slots:', await res.json());
            }
        };
    
        fetchDoctorTimes();
    }, [selectedTimeId]);
    console.log("selectedTimeId date: ",selectedTimeId);
    

    const fetchADoctorById = async (id) => {

        const res = await fetchDoctorById(id)
        console.log("res: ", res);
        if(res && res.data) {
            setDataDoctor(res.data)
        }
    }
    console.log("data doctor: ", dataDoctor);
    
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;
    };

    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };
    
    const englishToVietnameseDays = {
        "Sunday": "Chủ nhật",
        "Monday": "Thứ 2",
        "Tuesday": "Thứ 3",
        "Wednesday": "Thứ 4",
        "Thursday": "Thứ 5",
        "Friday": "Thứ 6",
        "Saturday": "Thứ 7"
    };   

    // hiển thị trong drawer
    const listTime = dataDoctor?.thoiGianKham.map(item => item.date) || [];        

    console.log("listTime: ",listTime);

    const styleTime = (index) => ({
        cursor: "pointer",
        fontSize: "18px",
        color: hoveredIndex === index ? 'red' : 'black', // Đổi màu chữ khi hover
    });
    
    
    const handleRedirectDoctor = (item, thoiGianKhamBenh, listTime) => {
        navigate(`/page-dat-lich-kham?id=${item._id}&idGioKhamBenh=${thoiGianKhamBenh}&ngayKham=${listTime}`)
    }    

    return (
        <>
            <div className='layout-app'>
                <HeaderViewDoctor />
                {/* <div className='body-view-doctor'>
                    <Row>
                        <Col span={24} style={{backgroundColor: "white", height: "7vh"}}>
                            <p style={{ color: "rgb(69, 195, 210)", fontSize: "15px", marginLeft: "5px", top: "-5px", position: "relative"}}>
                                <HomeOutlined /> /Khám chuyên khoa/ Cơ xương khớp
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={21} sm={21} xs={21} span={21} push={3} style={{backgroundColor: "white",}}>
                            <p style={{fontSize: "30px", marginTop: "10px", fontWeight: "500"}}>BSCKII Dương Minh Trí</p>
                            <p style={{fontSize: "15px", marginTop: "-20px", color: "#999999", lineHeight: "22px"}}>Trưởng khoa Nội Cơ Xương Khớp, Bệnh viện Nhân dân Gia Định <br/>
                            Nhiều năm kinh nghiệm trong khám và điều trị bệnh lý về Nội Cơ xương khớp  <br/>
                            Bác sĩ nhận khám cho bệnh nhân từ 16 tuổi trở lên</p>
                            <p style={{fontSize: "15px", marginTop: "-5px",}}><FaLocationDot />
                                <span style={{marginLeft: "5px"}}>Thành phố Hồ Chí Minh</span>
                            </p>
                        </Col>

                        <Col md={3} sm={24} xs={24} span={3} pull={21} style={{backgroundColor: "white", textAlign: "center"}}>
                            <Avatar src={"https://cdn.bookingcare.vn/fo/w256/2021/06/15/152136-bs-tri.jpg"} size={120} icon={<UserOutlined />} />    
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12} style={{backgroundColor: "greenyellow",}}>
                            <Col span={24} style={{backgroundColor: "white"}}>
                                <p  onClick={showDrawer} 
                                    style={{
                                        color: "rgb(69, 195, 210)", fontWeight: "500", fontSize: "16px", padding: "10px", cursor: "pointer"
                                    }}>
                                    Hôm nay - 30/9 
                                    <DownOutlined style={{fontSize: "14px", marginLeft: "10px", fontWeight: "600"}} /> 
                                    <hr style={{ width: "140px", margin: "5px 0 0"}}/>
                                </p>

                                <Drawer
                                    title="Thông tin lịch khám bệnh của bác sĩ"
                                    placement={placement}
                                    closable={false}
                                    onClose={onClose}
                                    open={open}
                                    key={placement}
                                >
                                    <p>Some contents...</p>
                                    <p>Some contents...</p>
                                    <p>Some contents...</p>
                                </Drawer>
                            </Col>    

                            <Col span={24}  style={{backgroundColor: "white", top: "-10px", position: "relative"}}>
                                <p style={{
                                    color: "gray", fontSize: "16px", fontWeight: "500", padding: "10px"
                                }}>
                                    <FaRegCalendarAlt />
                                    <span style={{marginLeft: "10px"}}>LỊCH KHÁM</span>    
                                </p>
                            </Col> 

                            

                        </Col>
                        <Col span={12} style={{backgroundColor: "whitesmoke",}}>col-12</Col>
                    </Row>
                </div> */}

                <Row>
                    <Col span={18} className='body-view-doctocc'>
                        <Row>
                            <Col span={24} style={{backgroundColor: "white", height: "7vh"}}>
                                <p style={{ color: "rgb(69, 195, 210)", fontSize: "15px", marginLeft: "5px", top: "-5px", position: "relative"}}>
                                    <HomeOutlined /> /Các chuyên khoa/ 
                                    {dataDoctor ? dataDoctor.chuyenKhoaId.map(item => item?.name).join(', ') : 'Chưa có thông tin chuyên khoa'}
                                </p>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={21} sm={21} xs={21} span={21} push={3} style={{backgroundColor: "white",}}>
                                <p style={{fontSize: "25px", marginTop: "10px", fontWeight: "500"}}>
                                    {dataDoctor ? dataDoctor.chucVuId.map(item => item?.name).join(', ') : ''} - &nbsp;
                                    {dataDoctor?.lastName} {dataDoctor?.firstName}
                                </p>
                                <p style={{fontSize: "15px", marginTop: "-20px", color: "#999999", lineHeight: "22px"}}>
                                    
                                    Nhiều năm kinh nghiệm trong khám và điều trị bệnh lý <br/>
                                    Bác sĩ nhận khám cho bệnh nhân từ 16 tuổi trở lên
                                </p>
                                <p style={{fontSize: "15px", marginTop: "-5px",}}><FaLocationDot />
                                    <span style={{marginLeft: "5px"}}>{dataDoctor?.address}</span> &nbsp; &nbsp; - &nbsp;&nbsp;
                                    <span style={{marginLeft: "5px"}}><PhoneOutlined /> {dataDoctor?.phoneNumber}</span>
                                </p>                                
                                <Button type="primary" style={{marginRight: "10px", fontSize: "14px"}} icon={<LikeFilled />}>Thích 0</Button>                                
                                <Button type="primary" style={{fontSize: "14px"}} icon={<IoIosShareAlt />}>Chia sẻ</Button>
                            </Col>

                            <Col md={3} sm={24} xs={24} span={3} pull={21} style={{backgroundColor: "white", textAlign: "center"}}>
                                <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataDoctor?.image}`} size={120} icon={<UserOutlined />} />    
                            </Col>
                        </Row>

                        <Row>
                            <Col span={12} style={{backgroundColor: "white", borderRight: "1px solid rgba(228, 228, 221, 0.637)"}}>
                                <Col span={24} style={{backgroundColor: "white"}}>                                
                                    <p  onClick={showDrawer} 
                                        style={{
                                            color: "rgb(69, 195, 210)", fontWeight: "500", fontSize: "16px", padding: "10px 0", cursor: "pointer", 
                                        }}>                                         
                                        {/* <CaretRightOutlined /> */}
                                        {hienThiTime} {/* Hiển thị ngày đã chọn */}
                                        <DownOutlined style={{fontSize: "14px", marginLeft: "3px", fontWeight: "600"}} /> 
                                        {hienThiTime !== 'Bấm vào đây để xem lịch khám!' ? (
                                            <hr style={{ width: "130px", margin: "5px"}}/>
                                        ) : (
                                            <hr style={{ width: "230px", margin: "5px"}}/>
                                        )} 
                                        
                                    </p>

                                    <Drawer
                                        title={`Thông tin lịch khám bệnh của 
                                            ${dataDoctor ? dataDoctor.chucVuId.map(item => item?.name).join(', ') : ''}
                                            - ${dataDoctor?.lastName} ${dataDoctor?.firstName}`}                                        
                                        placement={placement}
                                        closable={false}
                                        onClose={onClose}
                                        open={open}
                                        key={placement}
                                        // height={450}
                                        // width={300}
                                        // style={{ backgroundColor: 'blue', color: 'white' }} // Thay đổi màu nền
                                    >
                                        {listTime.length > 0 ? (
                                            listTime
                                                .sort((a, b) => moment(a).unix() - moment(b).unix()) // Sắp xếp từ nhỏ đến lớn
                                                .map((time, index) => {
                                                    const formattedTime = moment(time).format("dddd - DD/MM"); // Định dạng lại thời gian
                                                    const vietnameseDay = englishToVietnameseDays[moment(time).format("dddd")]; // Chuyển đổi tên ngày sang tiếng Việt
                                                    const displayTime = `${vietnameseDay} - ${moment(time).format("DD/MM")}`; // Tạo chuỗi hiển thị
                                                    return (
                                                        <p 
                                                            onClick={() => {                                                    
                                                                console.log("time: ", time);
                                                                setHienThiTime(displayTime)
                                                                setSelectedTimeId(time);
                                                                setSelectedDate(time); // Cập nhật ngày đã chọn
                                                                onClose(); // Đóng drawer
                                                            }}
                                                            onMouseEnter={() => setHoveredIndex(index)} // Khi hover vào thẻ
                                                            onMouseLeave={() => setHoveredIndex(null)} // Khi rời khỏi thẻ
                                                            className='times' 
                                                            style={styleTime(index)} 
                                                            key={index}
                                                        >
                                                            {displayTime} {/* Hiển thị thời gian đã định dạng */}
                                                        </p>
                                                    );
                                                })
                                        ) : (
                                            <p>Không có thời gian khám nào.</p>
                                        )}

                                        <Button color="default" variant="outlined" onClick={() => setOpen(false)}>Bỏ Qua</Button>
                                    </Drawer>
                                </Col>    

                                <Col span={24}  style={{backgroundColor: "white", top: "-18px", position: "relative"}}>
                                    <p style={{
                                        color: "gray", fontSize: "16px", fontWeight: "500", padding: "10px 0"
                                    }}>
                                        <FaRegCalendarAlt />
                                        <span style={{marginLeft: "10px"}}>LỊCH KHÁM</span>    
                                    </p>
                                    <Row justify="start" style={{marginTop: "-10px"}}>
                                        {hienThiTime !== 'Bấm vào đây để xem lịch khám!' ? (
                                            timeGioList.map((item, index) => (
                                                <Col span={4} className='cach-deu' onClick={() => handleRedirectDoctor(dataDoctor, item._id, selectedDate)}>
                                                    <div className='lich-kham' key={index}>
                                                    {item.tenGio}
                                                    </div>
                                                </Col>
                                            ))
                                        ) : (
                                            <span style={{color: "red", margin: "0 0 10px"}}>Không có thời gian khám nào. 
                                            <br/> Chọn lịch đi cậu
                                            </span>
                                        )}                                                                                                                          
                                    </Row>
                                </Col>                            

                                <Col span={24}  style={{backgroundColor: "white", top: "-30px", position: "relative"}}>
                                    <p style={{fontSize: "14px", color: "gray"}}>
                                        Chọn <FaRegHandPointUp size={14} /> và đặt (Phí đặt lịch 0đ)
                                    </p>
                                </Col>
                            </Col>

                            <Col span={12} style={{backgroundColor: "white", padding: "45px 20px"}}>
                                <p style={{fontWeight: "500"}}>ĐỊA CHỈ KHÁM</p>
                                <p style={{fontWeight: "500"}}>Phòng khám {dataDoctor?.phongKhamId.name} Bác sĩ {dataDoctor?.lastName} {dataDoctor?.firstName}</p>
                                <p>{dataDoctor?.phongKhamId.address}</p>
                               
                                {showDetails ? (
                                    <div>
                                        <p style={{ fontWeight: "500" }}>GIÁ KHÁM:</p>
                                        <div style={{
                                            backgroundColor: "#f7f7f7", border: "1px solid #d9d2d2",
                                            display: "flex", justifyContent: "space-between"
                                        }}>
                                            <span className='span-gia-kham'>
                                                <p style={{ fontWeight: "500" }}>Giá khám cho người Việt</p>
                                                <p>Giá khám chưa bao gồm chi phí chụp chiếu, xét nghiệm</p>
                                            </span>
                                            <span style={{ lineHeight: "70px", marginRight: "5px", color: "red", fontWeight: "500" }} className='span-gia-kham'>
                                            {formatCurrency(dataDoctor?.giaKhamVN)}
                                            </span>
                                        </div>

                                        <div style={{
                                            backgroundColor: "#f7f7f7", border: "1px solid #d9d2d2",
                                            display: "flex", justifyContent: "space-between"
                                        }}>
                                            <span className='span-gia-kham'>
                                                <p style={{ fontWeight: "500" }}>Giá khám cho người nước ngoài</p>
                                                <p>Giá khám chưa bao gồm chi phí chụp chiếu, xét nghiệm</p>
                                            </span>
                                            <span style={{ lineHeight: "70px", marginRight: "5px", color: "red", fontWeight: "500" }} className='span-gia-kham'>
                                            {formatCurrency(dataDoctor?.giaKhamNuocNgoai)}
                                            </span>
                                        </div>
                                        <a onClick={toggleDetails} style={{ float: "right", marginTop: "5px" }}>Ẩn bảng giá</a>
                                    </div>
                                ) : (
                                    <p>
                                        <span style={{ fontWeight: "500", color: "gray" }}>GIÁ KHÁM:</span> &nbsp;
                                        <span style={{color: "red", fontWeight: "500"}}>{formatCurrency(dataDoctor?.giaKhamVN)}</span> đến <span style={{color: "red", fontWeight: "500"}}>{formatCurrency(dataDoctor?.giaKhamNuocNgoai)}</span>
                                        <a onClick={toggleDetails} style={{ marginLeft: "10px" }}>Xem chi tiết</a>
                                    </p>
                                )}                                
                            </Col>
                        </Row>

                    </Col>
                </Row>
                <Row> 
                    <Col span={24} style={{backgroundColor: "#f7f7f7", borderTop: "1px solid rgba(228, 228, 221, 0.637)", marginTop: "20px"}}>
                        <Row>
                            <Col span={18} style={{margin: "auto",}}>
                                <div dangerouslySetInnerHTML={{ __html: dataDoctor?.mota }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row> 
                    <Col span={24} style={{backgroundColor: "#f7f7f7", borderTop: "1px solid rgba(228, 228, 221, 0.637)", marginTop: "20px"}}>
                        <Row>
                            <Col span={18} style={{margin: "auto",}}>
                            phản hồi ở đây
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Footer />
            </div>        
        </>
    )

}
export default PageViewDoctor