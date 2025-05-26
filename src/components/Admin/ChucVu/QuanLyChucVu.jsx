import { Button, Col, Row, Space, Table, Input, Pagination, message, notification, Popconfirm } from "antd"
import AdminLayout from "../AdminLayout"
import { IoAddOutline } from "react-icons/io5"
import { useEffect, useState } from "react"
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
const { Search } = Input;
const { Column, ColumnGroup } = Table;
import './css.scss';
import moment from "moment";
import { deleteChucVu, fetchAllChucVu } from "../../../services/apiDoctor";
import CreateChucVu from "./CreateChucVu";
import UpdateChucVu from "./UpdateChucVu";

const QuanLyChucVu = () => {
    
    const [loadingTable, setLoadingTable] = useState(false)
    const [dataChucVu, setDataChucVu] = useState([])

    const [opentCreateChucVu, setOpenCreateChucVu] = useState(false)
    const [openUpdateChucVu, setOpenUpdateChucVu] = useState(false)
    const [dataUpdateChucVu, setDataUpdateChucVu] = useState(null)

    const [currentPage, setCurrentPage] = useState(1);
    const [totalChucVu, setTotalChucVu] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    // dùng để search doctor
    const [tenChucVu, setTenChucVu] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    

    useEffect(() => {
        fetchListChucVu()
    }, [currentPage, pageSize, tenChucVu])

    const fetchListChucVu = async () => {
        setLoadingTable(true)
        let query = `page=${currentPage}&limit=${pageSize}`

        // Thêm tham số tìm kiếm vào query nếu có
        if (tenChucVu) {
            query += `&name=${encodeURIComponent(tenChucVu)}`;
        }        
    
        const res = await fetchAllChucVu(query)
        console.log("res chucvu: ", res);
        if (res && res.data) {
            setDataChucVu(res.data)
            setTotalChucVu(res.totalChucVu); // Lưu tổng số chucvu
        }
        setLoadingTable(false)
    }

    const handleDeleteChucVu = async (id) => {

        const res = await deleteChucVu(id)
        if(res){
            notification.success({
                message: "Xóa thông tin chức vụ",
                description: "Bạn đã xoá thành công"
            })
            await fetchListChucVu()
        } else {
            notification.error({
                message: "Xoá chức vụ",
                description: JSON.stringify(res.message)
            })
        }
    }

    const cancelXoa = (e) => {
        console.log(e);
        message.error('Huỷ xoá');
    }; 

    const onChangePagination = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize); // Cập nhật pageSize nếu cần
    };

    return (
        <>
            <AdminLayout 
                pageTitle="Quản lý chức vụ" 
                setTenChucVu={setTenChucVu}
                placeholder={'Tìm kiếm chức vụ ở đây...'}
            >
                <Row>
                    <Col span={24} style={{padding: "0 0 20px", fontSize: "18px"}}>
                        <span style={{fontWeight: "500", color: "navy"}}>THÔNG TIN CHỨC VỤ</span>
                        <Space size={10} style={{ float: "right" }}>
                            <Button 
                            type="primary" 
                            style={{
                                lineHeight: "15px"
                            }}
                            icon={<IoAddOutline size={20} />} 
                            className="custom-row"
                            onClick={() => {
                                setOpenCreateChucVu(true)
                            }}
                            >Thêm chức vụ</Button>
                        </Space>
                    </Col>
                </Row>
                <Row>
                    <Col xs={24} sm={12} md={24} span={24}>
                        <Table  dataSource={dataChucVu} 
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
                                <Column title={<p className="title-col-style">Tên chức vụ</p>} dataIndex="name" key="name" />
                                <Column title={<p className="title-col-style">Mô tả</p>} dataIndex="description" key="description" width={200} />
                                <Column 
                                    title={<p className="title-col-style">Ngày tạo</p>} 
                                    dataIndex="createdAt" 
                                    key="createdAt"
                                    render={(text) => (
                                        <>
                                            {moment(text).format('DD/MM/YYYY')}
                                            <br />
                                            {moment(text).format('HH:mm:ss')}
                                        </>
                                    )}
                                    width={200}  /> 
                                <Column 
                                    title={<p className="title-col-style">Ngày chỉnh sửa</p>} 
                                    dataIndex="updatedAt" 
                                    key="updatedAt"
                                    render={(text) => (
                                        <>
                                            {moment(text).format('DD/MM/YYYY')}
                                            <br />
                                            {moment(text).format('HH:mm:ss')}
                                        </>
                                    )}
                                    width={200}  /> 
                                <Column
                                    title={<p className="title-col-style">Chức năng</p>}
                                    key="action"
                                    render={(_, record) => (
                                        <Space size="middle">                                        
                                            <EditOutlined style={{color: "orange"}} onClick={() => {
                                                console.log("record update: ", record);
                                                setOpenUpdateChucVu(true)
                                                setDataUpdateChucVu(record)
                                            }} /> 

                                            <Popconfirm
                                                title={`xóa chức vụ`}
                                                description="Bạn có chắc chắn muốn xoá?"
                                                onConfirm={() => handleDeleteChucVu(record._id)}
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
                            total={totalChucVu}
                            onChange={(page, pageSize) => onChangePagination(page, pageSize)}  // Gọi hàm onChangePagination khi thay đổi trang
                            showSizeChanger={true}
                            showQuickJumper={true}
                            showTotal={(total, range) => (
                                <div>{range[0]}-{range[1]} trên {total} chức vụ</div>
                            )}
                            locale={{
                                items_per_page: 'dòng / trang',  // Điều chỉnh "items per page"
                                jump_to: 'Đến trang số',  // Điều chỉnh "Go to"
                                jump_to_confirm: 'Xác nhận',  // Điều chỉnh "Go"
                                page: '',  // Bỏ hoặc thay đổi chữ "Page" nếu cần
                            }}
                        /> 

                        <CreateChucVu 
                            opentCreateChucVu={opentCreateChucVu}
                            setOpenCreateChucVu={setOpenCreateChucVu}
                            fetchListChucVu={fetchListChucVu}
                        />            

                        <UpdateChucVu 
                            openUpdateChucVu={openUpdateChucVu}
                            setOpenUpdateChucVu={setOpenUpdateChucVu}
                            dataUpdateChucVu={dataUpdateChucVu}
                            setDataUpdateChucVu={setDataUpdateChucVu}
                            fetchListChucVu={fetchListChucVu}
                        />
                    </Col>
                </Row>
            </AdminLayout>
        </>
    )
}
export default QuanLyChucVu