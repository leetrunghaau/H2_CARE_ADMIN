import { Card, Collapse, Drawer } from "antd";
import { useState } from "react";
const { Meta } = Card;

const ViewPhongKham = (props) => {
    const {
        openDrawerDetail, setOpenDrawerDetail,
        dataDetail, setDataDetail
    } = props

    const [placement, setPlacement] = useState('right');

    console.log("dataDetail: ", dataDetail);

    const onClose = () => {
        setOpenDrawerDetail(false);
        setDataDetail(null)
    };

    const text = `
        ${dataDetail?.description}
    `;

    return (
        <Drawer
            title={dataDetail ? `Thông tin chi tiết của Phòng khám ${dataDetail.name} ` : "Thông tin Phòng khám"}
            placement={placement}
            width={450}
            onClose={onClose}
            open={openDrawerDetail}        
        >
            <Card
                hoverable
                style={{ width: 300, textAlign: "center", margin: "auto" }}
                cover={<img width={300} height={300} alt="example" src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${dataDetail?.image}`} />}
            >
                <Meta title={` Phòng khám: ${dataDetail?.name}`} description={`${dataDetail?.address}`} />   <br/>             
                <strong>Số điện thoại: {dataDetail?.sdtPK}</strong>
            </Card>
            <Collapse
                style={{marginTop: "30px"}}
                size="large"
                items={[
                    {
                    key: 'description',
                    label: 'Xem mô tả chi tiết',
                    children: <div className="truncate"  dangerouslySetInnerHTML={{ __html: text }} />,
                    },
                ]}
            />
        </Drawer> 
    )
}
export default ViewPhongKham