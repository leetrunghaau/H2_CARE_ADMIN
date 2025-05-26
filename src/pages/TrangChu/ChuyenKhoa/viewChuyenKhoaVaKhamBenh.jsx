import { Avatar, Button, Col, Drawer, Row, Select } from "antd"
import Footer from "../../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../../components/TrangChu/Header/HeaderViewDoctor"
import '../LichHen/lichhen.scss'
import { IoHomeSharp } from "react-icons/io5"
import { DownOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaLocationDot } from "react-icons/fa6"
import { fetchChuyenKhoaByID, fetchDoctorByChuyenKhoa, getTimeSlotsByDoctorAndDate } from "../../../services/apiDoctor"
import { FaRegCalendarAlt, FaRegHandPointRight, FaRegHandPointUp } from "react-icons/fa"
import moment from "moment"
import styled, { keyframes } from 'styled-components';

const shake = keyframes`
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
`;

const ShakeLink = styled.a`
    color: blue;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    font-style: italic;
    animation: ${shake} 0.5s ease-in-out infinite;
`;

const ViewChuyenKhoaVaKhamBenh = () => {

    let location = useLocation();
    // Phân tích cú pháp query string
    let params = new URLSearchParams(location.search);
    const idChuyenKhoa = params.get("idChuyenKhoa"); // Lấy giá trị của tham số "id"
    console.log("check id chuyen khoa: ", idChuyenKhoa);

    const navigate = useNavigate()
    const [dataChuyenKhoaByID, setDataChuyenKhoaByID] = useState(null)
    const [dataDoctorByChuyenKhoa, setDataDoctorByChuyenKhoa] = useState([])
    
    const [placement, setPlacement] = useState('top');
    const [open, setOpen] = useState(false);
    const [hienThiTime, setHienThiTime] = useState('Bấm vào đây để xem lịch khám!'); // State để lưu ngày đã chọn  
    console.log("hienThiTime: ",hienThiTime);
    const [hoveredIndex, setHoveredIndex] = useState(null); // State để theo dõi index của thẻ đang hover
    const [selectedDate, setSelectedDate] = useState(''); // State để lưu ngày đã chọn 
    const [selectedTimeId, setSelectedTimeId] = useState(null); 
    const [selectedDoctor, setSelectedDoctor] = useState(null); // State to store selected doctor
    const [timeGioList, setTimeGioList] = useState([]);    
    const [showDetails, setShowDetails] = useState(false);


    useEffect(() => {
        fetchCKByID(idChuyenKhoa);
        fetchDoctorByCK(idChuyenKhoa);
    }, [idChuyenKhoa]);

    const fetchCKByID = async (idChuyenKhoa) => {

        const res = await fetchChuyenKhoaByID(idChuyenKhoa)
        console.log("res: ", res);
        if(res && res.data) {
            setDataChuyenKhoaByID(res.data)
        }
    }

    const fetchDoctorByCK = async (idChuyenKhoa) => {

        const res = await fetchDoctorByChuyenKhoa(idChuyenKhoa)
        console.log("res: ", res);
        if(res && res.data) {
            setDataDoctorByChuyenKhoa(res.data)
        }
    }

    const handleRedirectDoctor = (item) => {
        navigate(`/view-doctor?id=${item}`)
    }

    const onChange = (value) => {
        console.log(`selected ${value}`);
    };
    const onSearch = (value) => {
        console.log('search:', value);
    };

    // -----------------------------------

    // const showDrawer = (doctor) => {
    //     setOpen(true);
    //     setSelectedDoctor(doctor); // Set the selected doctor

    //     setHienThiTime('Bấm vào đây để xem lịch khám!'); // Reset the displayed time
    //     setSelectedTimeId(null); // Reset the selected time ID
    //     setTimeGioList([]); // Clear the previous time slots

    //     fetchDoctorTimes(doctor._id);
    // };
    const showDrawer = (doctor) => {
        setOpen(true);
        setSelectedDoctor(doctor); // Set the selected doctor
        setHienThiTime('Bấm vào đây để xem lịch khám!'); // Reset the displayed time
        setSelectedTimeId(null); // Reset the selected time ID
        setTimeGioList([]); // Clear the previous time slots
    };

    

    const onClose = () => {
        setOpen(false);
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
    const toggleDetails = (doctorId) => {
        setShowDetails((prevState) => ({
            ...prevState,
            [doctorId]: !prevState[doctorId], // Toggle the specific doctor's details
        }));
    };

    const styleTime = (index) => ({
        cursor: "pointer",
        fontSize: "18px",
        color: hoveredIndex === index ? 'red' : 'black', // Đổi màu chữ khi hover
    });

    // hiển thị trong drawer
    const listTime = selectedDoctor?.thoiGianKham?.map(item => item.date) || [];        

    console.log("listTime: ",listTime);

    const fetchDoctorTimes = async (doctorId, date) => {
        if (!date) return; // Ensure an appointment date is selected
        let query = `doctorId=${doctorId}&date=${date}`;
        const res = await getTimeSlotsByDoctorAndDate(query);
        if (res && res.timeGioList) {
            setTimeGioList(res.timeGioList); // Set the fetched time slots
        } else {
            console.error('Error fetching time slots:', await res.json());
        }
    };
    useEffect(() => {
        if (selectedDoctor && selectedTimeId) {
            fetchDoctorTimes(selectedDoctor._id, selectedTimeId);
        }
    }, [selectedDoctor, selectedTimeId]);


    const handleTimeSelect = (time) => {
        const formattedTime = moment(time).format("dddd - DD/MM"); // Format the selected time
        setHienThiTime(formattedTime); // Update the display time
        setSelectedTimeId(time); // Update the selected time ID
        onClose(); // Close the drawer
    };
    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;
    };

    console.log("selectedDoctor: ", selectedDoctor);
    
    
    return (
        <>
        <HeaderViewDoctor />
        <Row>
            <Col span={18} className="col-body" >
                <Row 
                style={{ 
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${import.meta.env.VITE_BACKEND_URL}/uploads/${dataChuyenKhoaByID?.image})`, 
                    backgroundSize: 'contain',  // Adjust to 'contain' or use specific values
                    backgroundRepeat: 'no-repeat', // Prevent the image from repeating
                    backgroundPosition: 'center', 
                }}
                >
                    <Col span={24}>
                        <p className="txt-title"><IoHomeSharp /> / Khám chuyên khoa</p>
                        {/* <Divider/> */}
                        {/* <hr style={{border: "1px solid rgb(243, 243, 243)"}} /> */}
                    </Col>
                    <Col span={24}>
                        <span className="title-lichhen"> {dataChuyenKhoaByID?.name}</span>
                    </Col>   
                    <Col span={24}>
                        <span style={{marginLeft: "15px"}}> 
                            <div style={{marginTop: "-25px", marginLeft: "10px"}} dangerouslySetInnerHTML={{ __html: dataChuyenKhoaByID?.description }} />
                        </span>
                    </Col>                                                           
                </Row>
            </Col>
        </Row>   
        <br/>
        <Row>
            <Col span={24} className="view-body-xem-lich-ck">
                <Row>
                    <Col span={18} className="col-body" style={{backgroundColor: "rgb(247, 246, 246)", padding: "20px 10px"}} >
                        <Select
                            showSearch
                            placeholder="Chọn đi..."
                            optionFilterProp="label"
                            onChange={onChange}
                            onSearch={onSearch}
                            style={{width: "200px", marginBottom: "20px"}}
                            options={[
                            {
                                value: 'Toàn quốc',
                                label: 'Toàn quốc', 
                            },                                                   
                            ]}
                        />

                        {dataDoctorByChuyenKhoa?.length > 0 ? (
                            dataDoctorByChuyenKhoa.map((item, index) => (
                                <Col span={24} className="box-lich-kham" style={{backgroundColor: "white"}}>
                                    <Row>
                                        <Col span={13}>
                                            <Row>
                                                <Col span={4}>
                                                    <Avatar 
                                                    style={{cursor: "pointer"}}
                                                    onClick={() => handleRedirectDoctor(item._id)}
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${item?.image}`} 
                                                    size={80} icon={<UserOutlined />} />                                    
                                                </Col>
                                                <Col span={19}>
                                                    <p 
                                                        className="txt-bacsi" 
                                                        style={{lineHeight: "23px", cursor: "pointer"}} 
                                                        onClick={() => handleRedirectDoctor(item._id)}> {item ? item.chucVuId.map(item => item?.name).join(', ') : ''}   
                                                    </p>                                    
                                                    <p 
                                                        className="txt-bacsi colors" 
                                                        style={{cursor: "pointer"}} 
                                                        onClick={() => handleRedirectDoctor(item._id)}> {item?.lastName} {item?.firstName}
                                                    </p>
                                                    <p style={{fontSize: "15px", lineHeight: "22px", paddingLeft: "10px"}}>
                                            
                                                        Nhiều năm kinh nghiệm trong khám và điều trị bệnh lý <br/>
                                                        Bác sĩ nhận khám cho bệnh nhân từ 16 tuổi trở lên
                                                    </p>
                                                    <p style={{fontSize: "15px",}}><FaLocationDot />
                                                        <span style={{marginLeft: "5px"}}>{item?.address}</span>  &nbsp; - &nbsp;
                                                        <span style={{marginLeft: "5px"}}><PhoneOutlined /> {item?.phoneNumber}</span>
                                                    </p>
                                                </Col>
                                            </Row>
                                        </Col>   

                                        <Col span={11} style={{ borderLeft: "2px solid #f4f4f4"}}>
                                            <Row style={{marginLeft: "15px"}}>
                                                {/* <Col span={24}>
                                                    <p 
                                                        onClick={() => showDrawer(item)} 
                                                        style={{ color: "rgb(69, 195, 210)", fontWeight: "500", fontSize: "16px", cursor: "pointer" }}>
                                                        {hienThiTime} 
                                                        <DownOutlined style={{ fontSize: "14px", marginLeft: "3px", fontWeight: "600" }} />
                                                        {hienThiTime !== 'Bấm vào đây để xem lịch khám!' ? (
                                                            <hr style={{ width: "130px", margin: "5px" }} />
                                                        ) : (
                                                            <hr style={{ width: "230px", margin: "5px" }} />
                                                        )}
                                                    </p>

                                                    <Drawer
                                                        title={`Thông tin lịch khám bệnh của ${
                                                            selectedDoctor && selectedDoctor.chucVuId && selectedDoctor.chucVuId.length > 0 
                                                                ? selectedDoctor.chucVuId.map(cv => cv?.name).join(', ') 
                                                                : 'Chức vụ không xác định'
                                                        } - ${selectedDoctor?.lastName || 'Tên không xác định'} ${selectedDoctor?.firstName || ''}`}                              
                                                        placement={placement}
                                                        closable={false}
                                                        onClose={onClose}
                                                        open={open}
                                                        key={index}
                                                    >
                                                        {listTime.length > 0 ? (
                                                            listTime
                                                                .sort((a, b) => moment(a).unix() - moment(b).unix()) 
                                                                .map((time, index) => {
                                                                    const formattedTime = moment(time).format("dddd - DD/MM"); 
                                                                    const vietnameseDay = englishToVietnameseDays[moment(time).format("dddd")]; 
                                                                    const displayTime = `${vietnameseDay} - ${moment(time).format("DD/MM")}`; 

                                                                    return (
                                                                        <p 
                                                                            onClick={() => handleTimeSelect(time)} 
                                                                            onMouseEnter={() => setHoveredIndex(index)}
                                                                            onMouseLeave={() => setHoveredIndex(null)} 
                                                                            className='times' 
                                                                            style={styleTime(index)} 
                                                                            key={index}
                                                                        >
                                                                            {displayTime} 
                                                                        </p>
                                                                    );
                                                                })
                                                        ) : (
                                                            <p>Không có thời gian khám nào.</p>
                                                        )}
                                                        

                                                        <Button color="default" variant="outlined" onClick={() => setOpen(false)}>Bỏ Qua</Button>
                                                    </Drawer>
                                                </Col> */}

                                                <Col span={24}  style={{backgroundColor: "white", top: "-18px", position: "relative"}}>
                                                    <p style={{
                                                        color: "gray", fontSize: "16px", fontWeight: "500", 
                                                    }}>
                                                        <FaRegCalendarAlt />
                                                        <span style={{marginLeft: "10px"}}>LỊCH KHÁM</span>    
                                                    </p>
                                                    <ShakeLink onClick={() => handleRedirectDoctor(item._id)}>
                                                        <FaRegHandPointRight /> {''}Click vào đây để đi chọn lịch khám bệnh
                                                    </ShakeLink>                                                    
                                                    {/* <Row justify="start" style={{marginTop: "-10px"}}>
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
                                                    </Row> */}
                                                </Col>

                                                <Col span={24} style={{backgroundColor: "white",}}>
                                                    <p style={{fontWeight: "500"}}>ĐỊA CHỈ KHÁM</p>
                                                    <p style={{fontWeight: "500"}}>Phòng khám {item?.phongKhamId.name} Bác sĩ {item?.lastName} {item?.firstName}</p>
                                                    <p>{item?.phongKhamId.address}</p>
                                                
                                                    {showDetails[item._id] ? ( // Check the specific doctor's details
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
                                                                    {formatCurrency(item?.giaKhamVN)}
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
                                                                    {formatCurrency(item?.giaKhamNuocNgoai)}
                                                                </span>
                                                            </div>
                                                            <a onClick={() => toggleDetails(item._id)} style={{ float: "right", marginTop: "5px" }}>Ẩn bảng giá</a>
                                                        </div>
                                                    ) : (
                                                        <p>
                                                            <span style={{ fontWeight: "500", color: "gray" }}>GIÁ KHÁM:</span> &nbsp;
                                                            <span style={{ color: "red", fontWeight: "500" }}>{formatCurrency(item?.giaKhamVN)}</span> đến <span style={{ color: "red", fontWeight: "500" }}>{formatCurrency(item?.giaKhamNuocNgoai)}</span>
                                                            <a onClick={() => toggleDetails(item._id)} style={{ marginLeft: "10px" }}>Xem chi tiết</a>
                                                        </p>
                                                    )}                              
                                                </Col> 
                                            </Row>
                                           
                                        </Col>     
                                    </Row>  
                                </Col>

                            ))
                        ) : (
                            <Col span={24} className="box-lich-kham" style={{backgroundColor: "white"}}>
                                <p style={{ color: "red", fontSize: "22px", textAlign: "center" }}>Chưa có bác sĩ nào thuộc chuyên khoa này.</p>
                            </Col>
                        )}    
                    </Col>
                </Row> 
            </Col>    
        </Row>    
        <Footer/>
        </>
    )
}
export default ViewChuyenKhoaVaKhamBenh