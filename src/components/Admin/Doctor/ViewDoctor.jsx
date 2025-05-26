import { Badge, Button, Col, Collapse, Descriptions, Divider, Drawer, notification, Row } from "antd";
import moment from "moment";
import { useState } from "react";
import './css.scss'
import { xoaLichCu } from "../../../services/apiDoctor";

const ViewDoctor = (props) => {

    const {
        openViewDoctor, setOpenViewDoctor, dataDetailDoctor, setDataDetailDoctor, fetchListDoctor
    } = props
    const [placement, setPlacement] = useState('right');
    const [visibleCount, setVisibleCount] = useState(2); // Số lượng lịch hiển thị ban đầu
    const [isExpanded, setIsExpanded] = useState(false); // Trạng thái hiển thị tất cả lịch

    console.log("dataDetailDoctor: ", dataDetailDoctor);
    
    const onClose = () => {
        setOpenViewDoctor(false);
        setDataDetailDoctor(null)
    };

    const style = {
      background: '#d3ffa9',
      padding: '8px',
      textAlign: 'center',
      borderRadius: "8px"
    };

    //  hiển thị lịch trình từ mới về cũ
    const sortedSchedules = dataDetailDoctor?.thoiGianKham
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sắp xếp theo thứ tự giảm dần

    if (!sortedSchedules || sortedSchedules.length === 0) {
        return null; // Nếu không có lịch trình, không hiển thị gì
    }

    const scheduleItems1 = sortedSchedules.map((schedule) => (
        <div key={schedule._id}>
            <span style={{ fontWeight: "bold", fontSize: "18px", color: 'navy' }}>
                {moment(schedule.date).format('DD/MM/YYYY')}
            </span>
            <br /><br />
            <Row gutter={[10, 10]}>
                {schedule.thoiGianId
                    .sort((a, b) => {
                        const [startA] = a.tenGio.split(' - ');
                        const [startB] = b.tenGio.split(' - ');
                        return moment(startA, 'HH:mm').diff(moment(startB, 'HH:mm'));
                    })
                    .map((timeSlot) => (
                        <Col className="gutter-row" span={6} key={timeSlot._id}>
                            <div style={style}>{timeSlot.tenGio}</div>
                        </Col>
                    ))}
            </Row>
            <Divider />
        </div>
    ));
    // 

    // hiển thị tất cả lịch theo cũ đến mới
    const scheduleItems = dataDetailDoctor?.thoiGianKham
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, isExpanded ? dataDetailDoctor.thoiGianKham.length : visibleCount) // Lấy số lượng lịch theo trạng thái hiển thị
        .map((value) => (
            <div key={value._id}>
                <span style={{ fontWeight: "bold", fontSize: "18px", color: 'navy' }}>
                    {moment(value.date).format('DD/MM/YYYY')}
                </span>
                <br /><br />
                <Row gutter={[10, 10]}>
                    {value.thoiGianId
                        .sort((a, b) => {
                            const [startA] = a.tenGio.split(' - ');
                            const [startB] = b.tenGio.split(' - ');
                            return moment(startA, 'HH:mm').diff(moment(startB, 'HH:mm'));
                        })
                        .map((timeSlot) => (
                            <Col className="gutter-row" span={6} key={timeSlot._id}>
                                <div style={style}>{timeSlot.tenGio}</div>
                            </Col>
                        ))}
                </Row>
                <Divider />
            </div>
    ));
    const scheduleItems3 = dataDetailDoctor.thoiGianKham.length > 0 ? (
        dataDetailDoctor.thoiGianKham
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(value => (
                <div key={value._id}>
                    <span style={{ fontWeight: "bold", fontSize: "18px", color: 'navy' }}>
                        {moment(value.date).format('DD/MM/YYYY')}
                    </span>
                    <Row gutter={[10, 10]}>
                        {value.thoiGianId
                            .sort((a, b) => {
                                const [startA] = a.tenGio.split(' - ');
                                const [startB] = b.tenGio.split(' - ');
                                return moment(startA, 'HH:mm').diff(moment(startB, 'HH:mm'));
                            })
                            .map((timeSlot) => (
                                <Col className="gutter-row" span={6} key={timeSlot._id}>
                                    <div style={style}>{timeSlot.tenGio}</div>
                                </Col>
                            ))}
                    </Row>
                    <Divider />
                </div>
            ))
    ) : (
        <span>Chưa có lịch trình</span> // Thông báo khi không có lịch trình
    );

    

    const handleShowMore = () => {
        setVisibleCount(prevCount => prevCount + 2); // Tăng số lượng lịch hiển thị thêm 3
    };
    const handleToggleExpand = () => {
      setIsExpanded(prev => !prev); // Chuyển đổi trạng thái hiển thị
      if (!isExpanded) {
          setVisibleCount(dataDetailDoctor.thoiGianKham.length); // Đặt visibleCount bằng tổng số lịch khi mở rộng
      } else {
          setVisibleCount(2); // Đặt lại về 3 khi thu hẹp
      }
    };

    const handleDeleteDateCu = async () => {
        try {
            const response = await xoaLichCu(dataDetailDoctor._id); // Gọi hàm xóa lịch cũ
            console.log(response.data); // Kiểm tra phản hồi từ server
    
            // Cập nhật lại dữ liệu bác sĩ sau khi xóa
            // Hoặc nếu đã có dữ liệu trong state, có thể cập nhật trực tiếp
            setDataDetailDoctor(prevData => ({
                ...prevData,
                thoiGianKham: prevData.thoiGianKham.filter(slot => moment(slot.date).isSameOrAfter(moment(), 'day')) // Lọc lại lịch trình
            }));

            if (response && response.data) {
                notification.success({
                    message: 'Thành công',
                    description: response.message, 
                });
            } else {
                notification.error({
                    message: 'Không có gì để xóa!',
                    description: response.message,
                });
            }
            await fetchListDoctor(); // Cập nhật danh sách bác sĩ
        } catch (error) {
            console.error('Error deleting old schedules:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi xóa lịch trình cũ!',
            });
        }
    }

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '';
        return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} VNĐ`;
    };
 
    const items = [
        {
            key: 'image',
            label: 'Hình ảnh',
            children: <img style={{ width: 150, height: 140, objectFit: 'cover', borderRadius: "15%", border: "2px solid green" }}
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataDetailDoctor?.image}`} />,
        },
        {
            key: 'roleId',
            label: 'Quyền truy cập',
            children: <Badge status="processing" text={`${dataDetailDoctor?.roleId.key}`} />,
            span: 2,
        },
        {
            key: 'chucVuId', 
            label: 'Chức vụ',
            children: (
              <>
                  {dataDetailDoctor?.chucVuId.map((value, index) => (
                      <div key={value._id}>
                      {value.name}
                      {index < dataDetailDoctor.chucVuId.length - 1 && <br />} {/* Thêm <br /> nếu không phải là phần tử cuối */}
                      </div>
                  ))}
              </>
            ),
        },
        {
            key: 'chuyenKhoaId', span: 2,
            label: 'Chuyên khoa',
            children: (
                <>
                    {dataDetailDoctor?.chuyenKhoaId.map((value, index) => (
                        <div key={value._id}>
                        {value.name}
                        {index < dataDetailDoctor.chuyenKhoaId.length - 1 && <br />} {/* Thêm <br /> nếu không phải là phần tử cuối */}
                        </div>
                    ))}
                </>
            ),
        },
        
        {
            key: 'phongKhamId',
            label: 'Phòng khám',
            children: (
              <>
                  {dataDetailDoctor?.phongKhamId.name} 
                  <br/>
                  {dataDetailDoctor?.phongKhamId.address}
              </>
            ),
            span: 3
          },

            {
                key: 'giaKhamVN', 
                label: 'Giá khám Người Việt',
                children: (
                <div style={{color: "red"}}>
                    {formatCurrency(dataDetailDoctor?.giaKhamVN)}
                </div>
                ),
            },
            {
                key: 'giaKhamNuocNgoai', span: 2,
                label: 'Giá khám Người Nước Ngoài',
                children: (
                    <div style={{color: "red"}}>
                        {formatCurrency(dataDetailDoctor?.giaKhamNuocNgoai)}
                    </div>
                ),
            },

          {
            key: 'thoiGianKhamId',
            label: 'Lịch trình khám bệnh',
            children: (
              <>
                   <div>
                        {scheduleItems}
                        {dataDetailDoctor?.thoiGianKham.length > visibleCount && !isExpanded && (
                            <Button type="link" onClick={handleShowMore}>
                                Xem thêm
                            </Button>
                        )}
                        {isExpanded && (
                            <Button type="link" onClick={handleToggleExpand}>
                                Ẩn
                            </Button>
                        )}
                        {!isExpanded && dataDetailDoctor?.thoiGianKham.length > 3 && (
                            <Button type="link" onClick={handleToggleExpand}>
                                Xem tất cả
                            </Button>
                        )}
                        {/* <Button type="link" onClick={handleDeleteDateCu}>
                            Xóa lịch trình cũ
                        </Button> */}
                    </div>       
              </>
            ),
            span: 3
          },
        {
            key: 'createdAt',
            label: 'Ngày tạo',
            children: (
              <>
                {moment(dataDetailDoctor?.createdAt).format('DD/MM/YYYY')}
                {/* <br /> */} &nbsp; &nbsp;
                {moment(dataDetailDoctor?.createdAt).format('HH:mm:ss')}
              </>
            ),
          },
          {
            key: 'updatedAt',
            label: 'Ngày chỉnh sửa',
            children: (
              <>
                {moment(dataDetailDoctor?.updatedAt).format('DD/MM/YYYY')}
                {/* <br /> */} &nbsp; &nbsp;
                {moment(dataDetailDoctor?.updatedAt).format('HH:mm:ss')}
              </>
            ),
            span: 2,
          },
        
      ];

    const text = `${dataDetailDoctor?.mota}`
    return (
        <Drawer
            title={dataDetailDoctor ? `Thông tin chi tiết của Bác sĩ ${dataDetailDoctor.lastName} ${dataDetailDoctor.firstName}` : "Thông tin bác sĩ"}
            placement={placement}
            width={900}
            onClose={onClose}
            open={openViewDoctor}        
        >
            <Descriptions title="Chi tiết" bordered items={items} />
            
            <Collapse
                style={{marginTop: "30px"}}
                size="large"
                items={[
                    {
                    key: 'mota',
                    label: 'Xem mô tả chi tiết',
                    children: <div className="truncate"  dangerouslySetInnerHTML={{ __html: text }} />,
                    },
                ]}
            />
        </Drawer>
    )
}

export default ViewDoctor