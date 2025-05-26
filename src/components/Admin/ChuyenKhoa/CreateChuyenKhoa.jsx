import {
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  notification,
  Row,
  Upload,
} from "antd";
import { useState } from "react";
import {
  callUploadDoctorImg,
  createChuyenKhoa,
} from "../../../services/apiDoctor";
import "./css.scss";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const CreateCK = (props) => {
  //State
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isImagePreviewVisible, setIsImagePreviewVisible] = useState(false);

  //hooks & const
  const { openCreateChuyenKhoa, setOpenCreateChuyenKhoa, fetchListCK } = props;
  const [form] = Form.useForm();

  //Function
  const handleCreateCK = async (values) => {
    const { name, description } = values;
    if (!imageUrl) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload hình ảnh",
      });
      return;
    }

    const hinhAnh = imageUrl.split("/").pop();
    console.log("hinhanh: ", hinhAnh);

    setIsSubmit(true);
    const res = await createChuyenKhoa(name, description, hinhAnh);
    console.log("Data sent to API:", { name, description, hinhAnh });
    console.log("res create: ", res);
    if (res && res.data) {
      message.success("Tạo mới thông tin chuyên khoa thành công");
      form.resetFields();
      setImageUrl("");
      setOpenCreateChuyenKhoa(false);
      await fetchListCK();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

  const handleCancel = () => {
    setOpenCreateChuyenKhoa(false);
    setImageUrl("");
    form.resetFields();
  };

  // upload ảnh
  const handleUploadFileImage = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const res = await callUploadDoctorImg(file);
      console.log("res upload: ", res);
      if (res) {
        setImageUrl(res.url); // URL ảnh server
        onSuccess(file);
      } else {
        onError("Đã có lỗi khi upload file");
      }
    } catch (error) {
      console.error(error);
      message.error("Upload thất bại");
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên hình ảnh JPG/PNG!");
    }
    return isJpgOrPng;
  };

  const handleChange = (info) => {
    if (info.file.status === "done") {
      message.success(`upload file ${info.file.name} thành công`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} upload file thất bại!`);
    }
  };

  const handleRemoveFile = (file) => {
    setImageUrl(""); // Reset URL khi xóa file
    message.success(`${file.name} đã được xóa`);
  };

  // mở đóng modal hình ảnh
  const handlePreview = async () => {
    if (imageUrl) {
      setIsImagePreviewVisible(true);
    }
  };

  return (
    <Modal
      title="Tạo mới thông tin CHUYÊN KHOA"
      open={openCreateChuyenKhoa}
      onOk={() => form.submit()}
      onCancel={() => handleCancel()}
      width={600}
      maskClosable={false}
      confirmLoading={isSubmit}
      okText={"Xác nhận tạo mới"}
      cancelText="Huỷ">
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
            onFinish={handleCreateCK}
            autoComplete="off"
            loading={isSubmit}>
            <Row gutter={[20, 5]}>
              <Col span={24} md={24} sm={24} xs={24}>
                <Form.Item
                  layout="vertical"
                  label="Tên chuyên khoa"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập đầy đủ thông tinị!",
                    },
                  ]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24} md={24} sm={24} xs={24}>
                <Form.Item label="Hình ảnh" name="image">
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
                    onPreview={handlePreview}>
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>

                  <Modal
                    visible={isImagePreviewVisible}
                    title="Xem Hình Ảnh"
                    footer={null}
                    onCancel={() => setIsImagePreviewVisible(false)}>
                    <img
                      height={500}
                      alt="image"
                      style={{ width: "100%" }}
                      src={imageUrl}
                    />
                  </Modal>
                </Form.Item>
              </Col>

              <Col span={24} md={24} sm={24} xs={24}>
                <Form.Item layout="vertical" label="Mô tả" name="description">
                  <CKEditor
                    editor={ClassicEditor}
                    config={{
                      toolbar: [
                        "heading",
                        "|",
                        "bold",
                        "italic",
                        "underline",
                        "|",
                        "fontColor",
                        "fontFamily",
                        "|",
                        "link",
                        "bulletedList",
                        "numberedList",
                        "|",
                        "insertTable",
                        "|",
                        "imageUpload",
                        "blockQuote",
                        "undo",
                        "redo",
                      ],
                      ckfinder: {
                        uploadUrl: "/path/to/your/upload/handler",
                      },
                    }}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      form.setFieldsValue({ description: data });
                      console.log({ data });
                    }}
                    style={{
                      height: "400px",
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};
export default CreateCK;
