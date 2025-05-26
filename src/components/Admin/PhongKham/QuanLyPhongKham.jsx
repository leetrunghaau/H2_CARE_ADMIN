import { Button, Col, Row, Space, Table, Input, Popconfirm, message, notification, Pagination } from 'antd'
import AdminLayout from '../AdminLayout'
import './css.scss'
import { IoAddOutline } from 'react-icons/io5'
import { FaFileExport } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import moment from 'moment'
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { deletePhongKham, fetchAllPhongKham } from '../../../services/apiDoctor'
import CreatePhongKham from './CreatePhongKham'
const { Search } = Input;
const { Column, ColumnGroup } = Table;
import parse from 'html-react-parser';
import UpdatePhongKham from './UpdatePhongKham'
import ViewPhongKham from './ViewPhongKham'

const QuanLyPhongKham = () => {

    const [loadingTable, setLoadingTable] = useState(false)
    const [dataPK, setDataPK] = useState(false)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPKs, setTotalPKs] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const [openCreatePK, setOpenCreatePK] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [dataUpdate, setDataUpdate] = useState('');
    const [openDrawerDetail, setOpenDrawerDetail] = useState(false);
    const [dataDetail, setDataDetail] = useState('');

    // dùng để search doctor
    const [tenPK, setTenPK] = useState('');
    const [addressPK, setAddressPK] = useState('');

    useEffect(() => {
        fetchListPK()
    }, [currentPage, pageSize, tenPK, addressPK ])

    const fetchListPK = async () => {
        setLoadingTable(true)
        let query = `page=${currentPage}&limit=${pageSize}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenPK) {
            query += `&name=${encodeURIComponent(tenPK)}`;
        }        
        if (addressPK) {
            query += `&address=${encodeURIComponent(addressPK)}`;
        }
    
        const res = await fetchAllPhongKham(query)
        console.log("res phong kham: ", res);
        if (res && res.data) {
            setDataPK(res.data)
            setTotalPKs(res.totalPhongKham); // Lưu tổng số bác sĩ
        }
        setLoadingTable(false)
    }

    const handleDeletePK = async (id) => {

        const res = await deletePhongKham(id)
        if(res){
            notification.success({
                message: "Xóa thông tin phòng khám",
                description: "Bạn đã xoá thành công"
            })
            await fetchListPK()
        } else {
            notification.error({
                message: "Xoá phòng khám",
                description: JSON.stringify(res.message)
            })
        }
    }

    const onChangePagination = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize); // Cập nhật pageSize nếu cần
    };

    const cancelXoa = (e) => {
        console.log(e);
        message.error('Huỷ xoá');
    }; 
    return (
        <>
            <AdminLayout 
                pageTitle="Quản lý phòng khám" 
                setTenPK={setTenPK}
                setAddressPK={setAddressPK}
                placeholder={'Tìm kiếm phòng khám ở đây...'}
            >
                <Row>
                    <Col span={24} style={{padding: "0 0 20px", fontSize: "18px"}}>
                        <span style={{fontWeight: "500", color: "navy"}}>THÔNG TIN PHÒNG KHÁM</span>
                        <Space size={10} style={{ float: "right" }}>
                            <Button 
                            type="primary" 
                            style={{
                                lineHeight: "15px"
                            }}
                            icon={<IoAddOutline size={20} />} 
                            className="custom-row"
                            onClick={() => {
                                setOpenCreatePK(true)
                            }}
                            >Thêm thông tin phòng khám</Button>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={12} md={24} span={24}>
                        <Table  dataSource={dataPK} 
                                loading={loadingTable}
                                pagination={false} // Tắt phân trang mặc định của Table
                                scroll={{ x: 'max-content' }}
                                rowClassName="custom-row" // Thêm lớp cho hàng    
                                headerClassName="custom-header" // Lớp cho tiêu đề 
                                rowKey="_id" // Hoặc key tương ứng                           
                        >
                            <Column title={<p className="title-col-style">STT</p>}
                                dataIndex="stt" 
                                key="stt" 
                                render={(_, record, index) => {
                                    //   console.log("index: ", index+1);
                                    return (
                                        <>
                                        {(index+1) + (currentPage - 1) * pageSize}
                                        </>
                                    )
                                }
                            }/>   
                            {/* <Column
                                title={<p className="title-col-style">Image</p>}
                                dataIndex="image"
                                key="image"
                                render={(text) => {
                                    const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${text}`;
                                    console.log("Image URL:", imageUrl); // In ra URL để kiểm tra
                                    return (
                                        <img
                                            src={imageUrl}
                                            alt={`doctor ${text}`}
                                            style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: "50%", border: "1px solid navy" }}
                                        />
                                    );
                                }}
                            /> */}
                            <Column title={<p className="title-col-style">Tên phòng khám</p>} dataIndex="name" key="name" />
                            <Column title={<p className="title-col-style">Địa chỉ</p>} dataIndex="address" key="address" width={550}  />
                            {/* <Column 
                                title={<p className="title-col-style">Mô tả</p>} 
                                dataIndex="description" 
                                key="description" 
                                width={100}  
                                render={(text) => {
                                    if (!text) {
                                        return <div></div>; // Trả về một div trống nếu text là undefined hoặc falsy
                                    }

                                    return (
                                        <div className="truncate"  dangerouslySetInnerHTML={{ __html: text }} />
                                    ); // Hiển thị nội dung HTML
                                }}
                            />                             */}
                            <Column
                                title={<p className="title-col-style">Chức năng</p>}
                                key="action"
                                render={(_, record) => (
                                    <Space size="middle">
                                        <EyeOutlined style={{color: "green", fontWeight: "bold", cursor: "pointer"}} 
                                            onClick={() => {
                                                console.log("record: ", record);                                                
                                                setOpenDrawerDetail(true)
                                                setDataDetail(record)
                                            }} 
                                        />

                                        <EditOutlined style={{color: "orange"}} onClick={() => {
                                            console.log("record update: ", record);
                                            setOpenModalUpdate(true)
                                            setDataUpdate(record)
                                        }} /> 

                                        <Popconfirm
                                            title={`xóa phòng khám`}
                                            description="Bạn có chắc chắn muốn xoá?"
                                            onConfirm={() => handleDeletePK(record._id)}
                                            onCancel={cancelXoa}
                                            okText="Xác nhận xoá"
                                            cancelText="Không Xoá"
                                        >
                                            <DeleteOutlined style={{color: "red"}} />
                                        </Popconfirm>
                                    </Space>
                                )}
                            />
                        </Table>

                        <Pagination 
                            style={{
                                fontSize: "17px",
                                display: "flex",
                                justifyContent: "center",
                                margin: "10px 0 20px 0"
                            }}
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalPKs}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} phòng khám</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        />

                        <CreatePhongKham 
                            openCreatePK={openCreatePK}
                            setOpenCreatePK={setOpenCreatePK}
                            fetchListPK={fetchListPK}
                        />

                        <UpdatePhongKham 
                            fetchListPK={fetchListPK}
                            openModalUpdate={openModalUpdate}
                            setOpenModalUpdate={setOpenModalUpdate}
                            dataUpdate={dataUpdate}
                        />

                        <ViewPhongKham 
                            openDrawerDetail={openDrawerDetail}
                            setOpenDrawerDetail={setOpenDrawerDetail}
                            dataDetail={dataDetail}
                            setDataDetail={setDataDetail}
                        />
                    </Col>
                </Row>
            </AdminLayout>
        </>
    )
}
export default QuanLyPhongKham