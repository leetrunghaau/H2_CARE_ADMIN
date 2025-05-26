import { Col, Divider, Form, Input, message, Modal, notification, Row, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import { callUploadDoctorImg, updatePhongKham } from "../../../services/apiDoctor";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const UpdatePhongKham = (props) => {
    const {
        fetchListPK, openModalUpdate, setOpenModalUpdate, dataUpdate
    } = props

    const editorRef = useRef(null);

    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false);

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [fileList, setFileList] = useState([]);    

    // hiển thị hình ảnh dạng modal khi upload muốn xem lại
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        if(openModalUpdate && dataUpdate?._id){

            // Tạo danh sách file cho Upload
            if (dataUpdate.image) {

                console.log(`ảnh: ${import.meta.env.VITE_BACKEND_URL}/api/doctor/upload/${dataUpdate.image}`);
                
                
                setFileList([
                    {
                        uid: '-1', // uid phải là một chuỗi duy nhất
                        name: dataUpdate.image, // Tên file
                        status: 'done', // Trạng thái
                        url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${dataUpdate.image}`, // Đường dẫn đến hình ảnh
                    },
                ]);                
            }
            const init = {
                _id: dataUpdate._id,
                name: dataUpdate.name,                    
                address: dataUpdate.address,
                sdtPK: dataUpdate.sdtPK,
                description: dataUpdate.description || '',                    
                image: dataUpdate.image                        
            }
            console.log("init: ", init);

            setImageUrl(dataUpdate.image)          
            form.setFieldsValue(init);
            if (editorRef.current) {
                editorRef.current.setData(dataUpdate.description || ''); // Set giá trị cho CKEditor
            }
        }
        return () => {
            form.resetFields();
        }
    },[dataUpdate, openModalUpdate])

    const handleCancel = () => {
        setOpenModalUpdate(false);
        setImageUrl('')
        form.resetFields()
    };

    // / upload ảnh   
    const handlePreview = async (file) => {
        setImageUrl(fileList[0].url); // Lấy URL của hình ảnh
        setIsModalVisible(true); // Mở modal
    };

    const handleUploadFileImage = async ({ file, onSuccess, onError }) => {

        setLoading(true);
        try {
            const res = await callUploadDoctorImg(file);
            console.log("res upload: ", res);            
            if (res) {
                setImageUrl(res.url); // URL của hình ảnh từ server
                // Cập nhật fileList với file mới 
                setFileList([ // Đặt lại fileList chỉ chứa file mới
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        url: res.url, // URL của hình ảnh từ server
                    },
                ]);
                onSuccess(file);
                message.success('Upload thành công');
            } else {
                onError('Đã có lỗi khi upload file');
            }            
        } catch (error) {
            console.error(error);
            message.error('Upload thất bại');
            onError(error);
        } finally {
            setLoading(false);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Bạn chỉ có thể tải lên hình ảnh JPG/PNG!');
        }
        return isJpgOrPng;
    };

    const handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`upload file ${info.file.name} thành công`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} upload file thất bại!`);
        }
    };

    const handleRemoveFile = (file) => {
        // setFileList(prevFileList => prevFileList.filter(item => item.uid !== file.uid)); // Loại bỏ file
        setFileList([]); // Reset fileList khi xóa file
        setImageUrl(''); // Reset URL khi xóa file
        message.success(`${file.name} đã được xóa`);
    };

    const handleUpdatePK  = async (values) => {

        const {_id, name, address, description , image, sdtPK} = values
        if (!imageUrl) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload hình ảnh'
            })
            return;
        }

        const hinhAnh = imageUrl.split('/').pop(); // Lấy tên file từ URL
        console.log("hinhanh: ", hinhAnh);

        setIsSubmit(true)
        const res = await updatePhongKham( _id, name, address, description , hinhAnh, sdtPK)

        if(res){
            message.success(res.message);
            handleCancel()
            setImageUrl('')
            await fetchListPK()
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message
            })
        }        
        setIsSubmit(false)
    }

    return (
        <Modal
            title="Chỉnh sửa thông tin phòng khám"
            open={openModalUpdate}
            onOk={() => form.submit()} 
            onCancel={() => handleCancel()}
            width={600}
            maskClosable={false}
            confirmLoading={isSubmit}
            okText={"Lưu"}
            cancelText="Huỷ"
        >
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
                        onFinish={handleUpdatePK}
                        autoComplete="off"
                        loading={isSubmit}
                    >
                        <Row gutter={[20,5]}>
                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    hidden
                                    labelCol={{ span: 24 }}
                                    layout="vertical"
                                    label="ID"
                                    name="_id"                                    
                                >
                                <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Tên phòng khám"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tinị!',
                                        },                                        
                                    ]}
                                    hasFeedback
                                >
                                <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Địa chỉ phòng khám"
                                    name="address"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tinị!',
                                        },                                        
                                    ]}
                                    hasFeedback
                                >
                                <Input />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Số điện thoại phòng khám"
                                    name="sdtPK"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ thông tinị!',
                                        }, 
                                        {
                                            pattern: /^0\d{9}$/,
                                            message: 'Số điện thoại phải có 10 chữ số và bẳt đầu bằng số 0, không chứa kí tự!',
                                        },                                       
                                    ]}
                                    hasFeedback
                                >
                                <Input style={{width: "100%"}} />
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24} >
                                <Form.Item
                                    label="Hình ảnh"
                                    name="image"                            
                                >
                                    <Upload
                                        name="file"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        maxCount={1}
                                        multiple={false}
                                        customRequest={handleUploadFileImage}
                                        beforeUpload={beforeUpload}
                                        onChange={handleChange}
                                        onRemove={handleRemoveFile}
                                        fileList={fileList} // Gán danh sách file
                                        onPreview={handlePreview}
                                    >
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>

                                    <Modal
                                        visible={isModalVisible}
                                        footer={null}
                                        title="Xem Hình Ảnh"
                                        onCancel={() => setIsModalVisible(false)}
                                    >
                                        <img alt="Uploaded" style={{ width: '100%' }} src={imageUrl} />
                                    </Modal>
                                </Form.Item>
                            </Col>

                            <Col span={24} md={24} sm={24} xs={24}>
                                <Form.Item
                                    layout="vertical"
                                    label="Mô tả"
                                    name="description"                                                                     
                                >
                                    <CKEditor
                                        editor={ClassicEditor}                                        
                                        config={{
                                            toolbar: [
                                                'heading', '|',
                                                'bold', 'italic', 'underline', '|',
                                                'fontColor', 'fontFamily', '|', // Thêm màu chữ và kiểu chữ
                                                'link', 'bulletedList', 'numberedList', '|',
                                                'insertTable', '|',
                                                'imageUpload', 'blockQuote', 'undo', 'redo'
                                            ],
                                            // Other configurations
                                            ckfinder: {
                                                uploadUrl: '/path/to/your/upload/handler', // Đường dẫn đến handler upload
                                            },
                                        }}
                                        data={form.getFieldValue('description') || ''} // Thiết lập giá trị mặc định
                                        onInit={(editor) => {
                                            editorRef.current = editor; // Gán ref khi CKEditor khởi tạo
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            form.setFieldsValue({ description: data }); // Cập nhật giá trị cho form
                                            console.log({ data }); // Lấy dữ liệu khi có thay đổi
                                        }}
                                        style={{
                                            height: '400px', // Đặt chiều cao cho CKEditor
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Col>
            </Row>
        </Modal>
    )
}
export default UpdatePhongKham