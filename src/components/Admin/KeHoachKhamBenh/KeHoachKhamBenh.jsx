import { Button, Checkbox, Col, DatePicker, Divider, Form, message, notification, Row, Select, Space } from "antd"
import AdminLayout from "../AdminLayout"
import { useEffect, useState } from "react"
import { addTimeKhamBenh, fetchAllDoctor, fetchAllTime, fetchAllTime2, getTimeSlotsByDoctorAndDate } from "../../../services/apiDoctor"
import moment from "moment"
import './css.scss'

const KeHoachKhamBenh = () => {

    const [form] = Form.useForm()
    const [dataDoctor, setDataDoctor] = useState('')
    const [dataTime, setDataTime] = useState('')
    const [selectedTimes, setSelectedTimes] = useState([]);

    const [currentDoctorId, setCurrentDoctorId] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(null);


    useEffect(() => {
        fetchAllDoctors()
    }, [])

    useEffect(() => {
        fetchAllTimes()
    }, [])

    useEffect(() => {
        const fetchDoctorTimes = async () => {
            if (form.getFieldValue('id') && form.getFieldValue('date')) {
                const doctorId = form.getFieldValue('id');
                const appointmentDate = form.getFieldValue('date').format('YYYY-MM-DD'); // Đảm bảo định dạng đúng

                let query = `doctorId=${doctorId}&date=${appointmentDate}`
                const res = await getTimeSlotsByDoctorAndDate(query);
                console.log("res: ", res);

                if (res) {
                    if (res.timeSlots) {
                        setSelectedTimes(res.timeSlots); // Cập nhật selectedTimes với thời gian có sẵn
                    }
                } else {
                    // Xử lý lỗi nếu cần
                    console.error('Error fetching time slots:', await res.json());
                }
            }
        };

        fetchDoctorTimes();
    }, [form.getFieldValue('_id'), form.getFieldValue('date')]);

    useEffect(() => {
        // Reset selected times khi thay đổi bác sĩ hoặc ngày khám
        form.setFieldsValue({ time: undefined }); // Clear the time field in the form
        setSelectedTimes([]); // Reset selected times
    }, [form]);

    const fetchAllDoctors = async () => {
        let query = `page=1&limit=1000`
        const res = await fetchAllDoctor(query)
        console.log("res doctor: ", res);
        if (res && res.data) {
            setDataDoctor(res.data)
        }
    }
    const fetchAllTimes = async () => {
        const res = await fetchAllTime()
        console.log("res doctor: ", res);
        if (res && res.data) {
            setDataTime(res.data)
        }
    }
    console.log("dataDoctor: ", dataDoctor);
    console.log("dataTime: ", dataTime);

    const handleTimeSelect = (timeId) => {

        // Kiểm tra xem thời gian đã được chọn chưa
        const newSelectedTimes = selectedTimes.includes(timeId)
            ? selectedTimes.filter(id => id !== timeId) // Nếu đã chọn thì bỏ chọn
            : [...selectedTimes, timeId]; // Nếu chưa chọn thì thêm vào danh sách đã chọn

        setSelectedTimes(newSelectedTimes); // Cập nhật trạng thái

        // Cập nhật giá trị của trường trong form
        form.setFieldsValue({ time: newSelectedTimes });
    };

    const handleDoctorChange = (doctorId) => {
        setCurrentDoctorId(doctorId); // Cập nhật bác sĩ hiện tại
    };
    const handleDateChange = (date, dateString) => {
        setAppointmentDate(dateString);
    };

    const handleSubmit = async (values) => {

        const { id, date } = values
        const appointmentDate = date.format('DD-MM-YYYY'); // Giữ định dạng mà không chuyển đổi
        console.log("Bác sĩ ID: ", id);
        console.log("Ngày khám: ", date);
        console.log("Ngày khám appointmentDate: ", appointmentDate);
        console.log("Thời gian đã chọn:", selectedTimes);


        // if (selectedTimes.length === 0) {
        //     message.error('Vui lòng chọn ít nhất một thời gian!');
        //     return;
        // }

        const res = await addTimeKhamBenh(appointmentDate, selectedTimes, id)
        console.log("res thêm time: ", res);
        if (res && res.data) {
            message.success(res.message);
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }
    }

    const onChange = (date, dateString) => {
        console.log(date, dateString);
    }

    return (
        <AdminLayout
            pageTitle="Kế hoạch khám bệnh"
            placeholder={''}
        >
            <Row>
                <Col span={24} style={{ padding: "0 0 20px", fontSize: "18px", textAlign: "center" }}>
                    <span style={{ fontWeight: "500", color: "navy" }}>KẾ HOẠCH KHÁM BỆNH CỦA BÁC SĨ</span>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                    <Form
                        form={form}
                        name="basic"
                        layout="vertical"
                        style={{
                            maxWidth: "100%",
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={handleSubmit}
                        autoComplete="off"
                    >
                        <Row gutter={[20, 5]}>
                            <Col span={19} md={19} sm={19} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Họ và Tên bác sĩ - Phòng khám ( địa chỉ )"
                                    name="id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn bác sĩ!',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="Chọn bác sĩ"
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={handleDoctorChange} // thêm cái này
                                        options={dataDoctor.length > 0 ? dataDoctor.map(doctor => ({
                                            value: doctor._id, // Sử dụng _id làm giá trị
                                            label: `${doctor.lastName} ${doctor.firstName} - 
                                            Phòng khám: ${doctor.phongKhamId.name} (${doctor.phongKhamId.address})
                                            `,
                                        })) : [{ value: '', label: 'Không có bác sĩ nào' }]} // Hiển thị thông báo nếu rỗng
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={5} md={5} sm={5} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Chọn ngày"
                                    name="date"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày!',
                                        },
                                    ]}
                                >
                                    <DatePicker
                                        placeholder="Chọn ngày khám"
                                        style={{ width: "100%" }}
                                        format="DD/MM/YYYY" // Định dạng ngày/tháng/năm
                                        onChange={handleDateChange} // thêm cái này
                                        // onChange={onChange} 
                                        disabledDate={current => current < moment().startOf('day')} // Không cho chọn ngày quá khứ
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* <Row gutter={[16, 16]}>
                            {dataTime.length > 0 ? (
                                dataTime.map(time => (
                                    <Col className="gutter-row" span={4} key={time._id}>
                                        <div
                                            className={`styles ${selectedTimes.includes(time._id) ? 'active' : ''}`}
                                            onClick={() => handleTimeSelect(time._id)}
                                        >
                                            {time.tenGio}
                                        </div>
                                    </Col>
                                ))
                            ) : (
                                <Col className="gutter-row" span={4}>
                                    <div className="styles">Không có time nào</div>
                                </Col>
                            )}
                        </Row> */}
                        <Form.Item
                            name="time" // Đặt tên cho trường thời gian
                        >
                            <Row gutter={[16, 16]}>
                                {dataTime.length > 0 ? (
                                    dataTime.map(time => (
                                        <Col className="gutter-row" span={4} key={time._id}>
                                            <div
                                                className={`styles ${selectedTimes.includes(time._id) ? 'active' : ''}`}
                                                onClick={() => {
                                                    handleTimeSelect(time._id);
                                                    // Cập nhật giá trị của trường trong form
                                                    form.setFieldsValue({ time: selectedTimes });
                                                }}
                                            >
                                                {time.tenGio}
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <Col className="gutter-row" span={4}>
                                        <div className="styles">Không có time nào</div>
                                    </Col>
                                )}
                            </Row>
                        </Form.Item>

                        {/* {dataTime.length > 0 ? (
                            <Form.Item
                                name="time"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
                            >
                                <Checkbox.Group>
                                    <Row gutter={[16, 16]}>
                                        {dataTime.map(time => (
                                            <Col span={4} key={time._id}>
                                                <Checkbox value={time._id}>
                                                    {time.tenGio}
                                                </Checkbox>
                                            </Col>
                                        ))}
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                        ) : (
                            <div>Không có thời gian nào để chọn.</div> // Hoặc bất kỳ nội dung nào bạn muốn hiển thị
                        )} */}


                        <Row gutter={[20, 20]}>
                            <Col span={24}>
                                <Form.Item>
                                    <br />
                                    <div style={{ textAlign: "center" }}>
                                        <Button type="primary" htmlType="submit">Lưu lại</Button>
                                    </div>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </AdminLayout>
    )
}
export default KeHoachKhamBenh