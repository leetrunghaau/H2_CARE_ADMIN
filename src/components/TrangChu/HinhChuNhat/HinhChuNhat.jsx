import { Col, Row } from "antd"

const HinhChuNhat = (props) => {

    const {src, txtP} = props

    return (
        <div className="hcn-toan-dien">
            <Row>
                <Col md={6} sm={8} xs={8}>
                    <div className="boc-ngoai-Imghcn">
                        <img style={{ width: "8vh", height: "8vh"}} src={src} alt="" />
                    </div>
                </Col>
                <Col md={18} sm={16} xs={16}>
                    <p style={{fontSize: "4vh", fontWeight: "500", textAlign: "start", lineHeight: "5vh"}}>{txtP}</p>
                </Col>
            </Row>
        </div>
    )
}
export default HinhChuNhat