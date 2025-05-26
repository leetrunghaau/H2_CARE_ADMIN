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
import { useEffect, useRef, useState } from "react";
import {
  callUploadDoctorImg,
  updateChuyenKhoa,
} from "../../../services/apiDoctor";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const UpdateCK = (props) => {
  //State
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  //Hooks & const
  const { fetchListCK, openModalUpdate, setOpenModalUpdate, dataUpdate } =
    props;

  const editorRef = useRef(null);

  const [form] = Form.useForm();

  //Effect
  useEffect(() => {
    if (openModalUpdate && dataUpdate?._id) {
      if (dataUpdate.image) {
        console.log(
          `ảnh: ${import.meta.env.VITE_BACKEND_URL}/api/doctor/upload/${
            dataUpdate.image
          }`
        );

        setFileList([
          {
            uid: "-1",
            name: dataUpdate.image,
            status: "done",
            url: `${import.meta.env.VITE_BACKEND_URL}/uploads/${
              dataUpdate.image
            }`,
          },
        ]);
      }
      const init = {
        _id: dataUpdate._id,
        name: dataUpdate.name,
        description: dataUpdate.description || "",
        image: dataUpdate.image,
      };
      console.log("init: ", init);

      setImageUrl(dataUpdate.image);
      form.setFieldsValue(init);
      if (editorRef.current) {
        editorRef.current.setData(dataUpdate.description || "");
      }
    }
    return () => {
      form.resetFields();
    };
  }, [dataUpdate, openModalUpdate]);

  //Function

  const handleCancel = () => {
    setOpenModalUpdate(false);
    setImageUrl("");
    form.resetFields();
  };

  // / upload ảnh
  const handlePreview = async (file) => {
    setImageUrl(fileList[0].url);
    setIsModalVisible(true);
  };

  const handleUploadFileImage = async ({ file, onSuccess, onError }) => {
    setLoading(true);
    try {
      const res = await callUploadDoctorImg(file);
      console.log("res upload: ", res);
      if (res) {
        setImageUrl(res.url);
        setFileList([
          {
            uid: file.uid,
            name: file.name,
            status: "done",
            url: res.url,
          },
        ]);
        onSuccess(file);
        message.success("Upload thành công");
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
    setFileList([]);
    setImageUrl(""); // Reset URL khi xóa file
    message.success(`${file.name} đã được xóa`);
  };

  const handleUpdatePK = async (values) => {
    const { _id, name, description, image } = values;
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
    const res = await updateChuyenKhoa(_id, name, description, hinhAnh);

    if (res) {
      message.success(res.message);
      handleCancel();
      setImageUrl("");
      await fetchListCK();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message,
      });
    }
    setIsSubmit(false);
  };

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
            onFinish={handleUpdatePK}
            autoComplete="off"
            loading={isSubmit}>
            <Row gutter={[20, 5]}>
              <Col span={24} md={24} sm={24} xs={24}>
                <Form.Item
                  hidden
                  labelCol={{ span: 24 }}
                  layout="vertical"
                  label="ID"
                  name="_id">
                  <Input />
                </Form.Item>
              </Col>
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
                    fileList={fileList}
                    onPreview={handlePreview}>
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  </Upload>

                  <Modal
                    visible={isModalVisible}
                    footer={null}
                    title="Xem Hình Ảnh"
                    onCancel={() => setIsModalVisible(false)}>
                    <img
                      alt="Uploaded"
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
                    data={form.getFieldValue("description") || ""}
                    onInit={(editor) => {
                      editorRef.current = editor;
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
export default UpdateCK;
