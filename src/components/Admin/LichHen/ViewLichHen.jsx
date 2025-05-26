import { UserOutlined } from "@ant-design/icons"
import { Avatar, Badge, Card, Collapse, Descriptions, Drawer } from "antd"
import moment from 'moment-timezone';
const { Meta } = Card;

const ViewLichHen = (props) => {

    const {
        openViewDH, dataViewDH, setOpenViewDH, setDataViewDH
    } = props

    const cancel = () => {
        setOpenViewDH(false)
        setDataViewDH(null)
    }

    const items = [
        {
          key: 'image',
          label: 'Hình ảnh',
          children:  <Avatar src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataViewDH?._idTaiKhoan?.image}`} shape="square" size={100} icon={<UserOutlined />} /> ,
        },
        {
          key: 'hoten',
          label: 'Họ và tên bệnh nhân',
          children: <span>{dataViewDH?.patientName} ({moment(dataViewDH?.dateBenhNhan).tz('Asia/Ho_Chi_Minh').format('DD-MM-YYYY')})</span>,
          span: 3,
        },     
        {
            key: 'phone',
            label: 'Số điện thoại',
            children: dataViewDH?.phone,
            span: 1,
          },  
        {
          key: 'address',
          label: 'Địa chỉ',
          children: dataViewDH?.address,
          span: 2,
        },        
          {
            key: 'ngayKham',
            label: 'Ngày khám',
            children: dataViewDH?.ngayKhamBenh,
            span: 1,
          },
          {
              key: 'priceKham',
              label: 'Chi phí khám bệnh',
              children: <span style={{color: "red"}}>{Math.ceil(dataViewDH?.giaKham).toLocaleString()} VNĐ</span>,
              span: 2,
            },        
        {
          key: '6',
          label: 'Lí do đi khám',
          children: <Badge status="processing" text={`${dataViewDH?.lidokham}`} />,
          span: 3,
        },
        {
            key: 'doctor',
            label: 'Bác sĩ khám',
            children: <span>{dataViewDH?._idDoctor?.lastName} {dataViewDH?._idDoctor?.firstName}</span>,
            span: 1.5,
        },
        {
            key: 'timeKham',
            label: 'Thời gian khám',
            children: dataViewDH?.tenGioKham,
            span: 1.5,
        },   
        {
            key: 'diachipk',
            label: 'Địa chỉ phòng khám',
            // children: <Badge status="processing" text={`${dataViewDH?._idDoctor?.phongKhamId?.address}`} />,
            children: <div>
                <Card
                    hoverable
                    style={{ width: 300, textAlign: "center", margin: "auto" }}
                    cover={<img width={300} height={300} alt="example" src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataViewDH?._idDoctor?.phongKhamId?.image}`} />}
                >
                    <Meta title={` Phòng khám: ${dataViewDH?._idDoctor?.phongKhamId?.name}`} description={`${dataViewDH?._idDoctor?.phongKhamId?.address}`} />
                </Card>
            {/* <Collapse
                style={{marginTop: "30px"}}
                size="large"
                items={[
                    {
                    key: 'description',
                    label: 'Xem mô tả chi tiết phòng khám',
                    children: <div className="truncate"  dangerouslySetInnerHTML={{ __html: dataViewDH?._idDoctor?.phongKhamId?.description }} />,
                    },
                ]}
            /> */}
            </div>,
            span: 3,
          },  
       
    ];

    return (
        <Drawer
            closable
            destroyOnClose
            title={<p >CHI TIẾT LỊCH HẸN <span style={{color: "navy", fontWeight: "bold"}}>#{dataViewDH?._id.slice(-6)}</span></p>}
            placement="left"
            open={openViewDH}
            onClose={cancel}
            width={850}
            // height={600}
        >
            <Descriptions title={`Chi tiết lịch hẹn của tài khoản đã đặt: ${dataViewDH?._idTaiKhoan?.lastName} ${dataViewDH?._idTaiKhoan?.firstName} (${dataViewDH?._idTaiKhoan?.email})`} bordered items={items} />
        </Drawer>
    )
}
export default ViewLichHen