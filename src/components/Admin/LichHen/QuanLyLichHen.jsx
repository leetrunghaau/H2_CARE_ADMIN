import { Col, Row, Space, Table, Tag, Tooltip } from "antd"
import AdminLayout from "../AdminLayout"
import { useEffect, useState } from "react"
import moment from 'moment-timezone';
import { CheckCircleOutlined, ExclamationCircleOutlined, HourglassOutlined } from "@ant-design/icons";
import { FaEye } from "react-icons/fa";
import { findAllLichHen } from "../../../services/apiDoctor";
import ViewLichHen from "./ViewLichHen";

const QuanLyLichHen = () => {

    const [dataOrder, setDataOrder] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [loadingOrder, setLoadingOrder] = useState(false);
    const [sortQuery, setSortQuery] = useState("sort=createdAt");

    const [openViewDH, setOpenViewDH] = useState(false)
    const [dataViewDH, setDataViewDH] = useState(null)
    const [lichHen, setLichHen] = useState('')

    const findAllOrder = async () => {
        setLoadingOrder(true)
        let query = `page=${current}&limit=${pageSize}`
        if (sortQuery) {
            query += `&${sortQuery}`;
        } 
        // Thêm tham số tìm kiếm vào query nếu có
        if (lichHen) {
            query += `&lichHen=${encodeURIComponent(lichHen)}`;
        } 
        let res = await findAllLichHen(query)
        console.log("res his order: ", res);
        if(res && res.data) {
            setDataOrder(res.data?.findOrder)
            setTotal(res.data?.totalOrder)
        }
        setLoadingOrder(false)
    }

    useEffect(() => {
        findAllOrder()
    },[lichHen, current, pageSize, sortQuery])

    const onChange = (pagination, filters, sorter, extra) => {
        console.log(">> check: pagination", pagination);
    
        // nếu thay dổi trang: current
        if(pagination && pagination.current){
          if( +pagination.current !== +current){
            setCurrent( +pagination.current) // ví dụ "5" -> 5
          }
        }
    
        // nếu thay đổi tổng số phần tử
        if(pagination && pagination.current){
          if( +pagination.pageSize !== +pageSize){
            setPageSize( +pagination.pageSize) // ví dụ "5" -> 5
          }
        }

        if (sorter && sorter.field) {
            const sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc'; // Determine sort order
            const newSortQuery = `sort=${sorter.field}&order=${sortOrder}`;
            if (newSortQuery !== sortQuery) {
                setSortQuery(newSortQuery); // Only update if sort query changes
            }
        }
    
        window.scrollTo({ top: 80, behavior: "smooth" });
    }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (text, record, index) => <span>{(index+1) + (current - 1) * pageSize}</span>, // Lấy 6 ký tự cuối cùng
            width: 100
        },
        {
            title: 'Mã đơn',
            dataIndex: '_id',
            key: '_id',
            render: (text) => <span style={{fontWeight: "bold"}}>#{text.slice(-6)}</span>, // Lấy 6 ký tự cuối cùng
            width: 100
        },
        {
            title: 'Ngày đặt lịch',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, record) => {
                return (
                    // <>{moment(record.createdAt).format('DD-MM-YYYY  (hh:mm:ss)')}</>
                    <>{moment(record.createdAt).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY (HH:mm:ss)')}</>
                )
            },
            sorter: true
        }, 
        {
            title: (
                <span style={{ justifyContent: "center", display: "flex" }}>
                    Trạng thái
                </span>
            ),
            key: "status",
            dataIndex: "status",
            render: (text, record) => {
                const getStatusTag = () => {
                    // Kiểm tra nếu trangThaiHuyDon là "Đã Hủy"
                    if (record.trangThaiHuyDon === 'Đã Hủy') {
                        return {
                            color: "red",
                            icon: <ExclamationCircleOutlined />,
                            label: "Đã Hủy",
                        };
                    }

                    // Khi trangThaiXacNhan === false và trangThaiKham === false: Chờ xác nhận
                    if (!record.trangThaiXacNhan && !record.trangThaiKham) {
                        return {
                            color: "orange",
                            icon: <ExclamationCircleOutlined />,
                            label: "Chờ xác nhận",
                        };
                    }
                    // Khi trangThaiXacNhan === true và trangThaiKham === false: Không hủy
                    if (record.trangThaiXacNhan && !record.trangThaiKham) {
                        return {
                            color: "blue",
                            icon: <CheckCircleOutlined />,
                            label: "Chờ khám",
                        };
                    }
                    // Khi trangThaiKham === true: Đã khám
                    if (record.trangThaiKham) {
                        return {
                            color: "green",
                            icon: <CheckCircleOutlined />,
                            label: "Đã khám",
                        };
                    }
                    // Mặc định trả về trạng thái "Chờ khám"
                    return {
                        color: "blue",
                        icon: <CheckCircleOutlined />,
                        label: "Chờ khám",
                    };
                };

                const statusTag = getStatusTag();  // Lấy thông tin trạng thái dựa trên các điều kiện

                return (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <Tag color={statusTag.color} icon={statusTag.icon}>
                            {statusTag.label}
                        </Tag>
                    </div>
                );
            },
        },       
        // {
        //   title: <span style={{justifyContent: "center", display: "flex"}}>Trạng thái</span>,
        //   key: 'status',
        //   dataIndex: 'status',
        //   render: (text, record) => {            
        //     const getStatusTagForTinhTrangDonHang = (status) => {
        //         if (status === "Không Hủy") {
        //             return { color: 'green', icon: <CheckCircleOutlined /> }; // khong huy
        //         }                
        //         return { color: 'red', icon: <ExclamationCircleOutlined /> }; // da huy
        //     };
        
        //     const getStatusTagForTinhTrangThanhToan = (status) => {
        //         return status === "Chưa đặt lịch"
        //         ? { color: 'red', icon: <ExclamationCircleOutlined /> }
        //         : { color: 'green', icon: <CheckCircleOutlined /> }; // "Đã Thanh Toán"
        //     };
        
        //     const donHangTag = getStatusTagForTinhTrangDonHang(record.trangThaiHuyDon);
        //     const thanhToanTag = getStatusTagForTinhTrangThanhToan(record.trangThai);
        //     return (
        //         <div style={{display: "flex", justifyContent: "center"}}>
        //         {record.trangThaiHuyDon === "Không Hủy" ? <>
        //             <Tag color={thanhToanTag.color} icon={thanhToanTag.icon}>
        //                 {record.trangThai}
        //             </Tag>
        //         </> : 
        //         <Tag color={donHangTag.color} icon={donHangTag.icon}>
        //             {record.trangThaiHuyDon}
        //         </Tag>
        //         }
                
                
        //         </div>                
        //     );
        //   },
        // },
        {
            title: 'Thông tin',
            dataIndex: 'total',
            key: 'total',
            render: (text, record) => {                
                return (
                    <>
                        <span>Đã đặt lịch: {record.tenGioKham} </span> <br/>
                        <span>Ngày: {record.ngayKhamBenh} </span> <br/>
                        <span>Tổng <span style={{color: "red"}}>{Math.ceil(record.giaKham).toLocaleString()} VNĐ</span> </span> 
                    </>
                );
            },
        },
        {
          title: 'Chức năng',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
                <Tooltip title="Xem chi tiết lịch hẹn này" color={'green'} key={'green'}>

                    <FaEye size={23} style={{color: "green", fontWeight: "bold", cursor: "pointer", fontSize: "18px"}} 
                        onClick={() => {
                            console.log("record: ", record);    
                            setOpenViewDH(true)    
                            setDataViewDH(record)                             
                        }} 
                    />
                </Tooltip>                
            </Space>
          ),
        },
    ];   

    return (
        <>
        <AdminLayout 
                pageTitle="Quản lý lịch hẹn" 
                setLichHen={setLichHen}
                placeholder={'Tìm kiếm lịch hẹn ở đây...'}
        >
            <Row>
                <Col span={24} style={{padding: "0 0 20px", fontSize: "18px"}}>
                    <span style={{fontWeight: "500", color: "navy"}}>THÔNG TIN LỊCH HẸN</span>                    
                </Col>
            </Row>
            <Row>
                    <Col xs={24} sm={12} md={24} span={24}>
                    <Table 
                        onChange={onChange}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} lịch hẹn</div>) }
                        }}
                        //  pagination={false}  // Tắt phân trang mặc định của Table
                        loading={loadingOrder} 
                        columns={columns} 
                        dataSource={dataOrder} /> 
                    </Col>

                    <ViewLichHen
                    openViewDH={openViewDH}
                    dataViewDH={dataViewDH}
                    setOpenViewDH={setOpenViewDH}
                    setDataViewDH={setDataViewDH}
                    />
            </Row>
        </AdminLayout>
        </>
    )
}
export default QuanLyLichHen