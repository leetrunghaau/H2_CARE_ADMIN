import { Col, Divider, Modal, Row } from "antd"

const ModalLichHen = (props) => {

  const { isModalOpen, setIsModalOpen, item } = props

  console.log("isModalOpen: ", isModalOpen);
  console.log("setIsModalOpen: ", setIsModalOpen);
  console.log("item: ", item);

  return (
    <>
      <Modal
        key={item?.id}
        style={{ marginTop: '5px' }} width={800}
        title={`Bệnh án chi tiết của ${item?.patientName}`}
        footer={null} open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
        <Divider />
        <Row>
          <Col span={24} md={24}>
            <div dangerouslySetInnerHTML={{ __html: item?.benhAn }} />
          </Col>
        </Row>
      </Modal>
    </>
  )
}
export default ModalLichHen