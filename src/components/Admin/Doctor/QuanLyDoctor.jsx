import {
  Button,
  Col,
  Pagination,
  Popconfirm,
  Row,
  Space,
  Table,
  Input,
  notification,
  message,
} from "antd";
import AdminLayout from "../AdminLayout";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { deleteDoctor, fetchAllDoctor } from "../../../services/apiDoctor";
import { IoAddOutline } from "react-icons/io5";
import { FaFileExport } from "react-icons/fa";
import ViewDoctor from "./ViewDoctor";
import "./css.scss";
import CreateDoctor from "./CreateDoctor";
import UpdateDoctor from "./UpdateDoctor";
import moment from "moment";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const { Column, ColumnGroup } = Table;

const QuanLyDoctor = (props) => {
  //State
  const [loadingTable, setLoadingTable] = useState(false);
  const [dataDoctor, setDataDoctor] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [openViewDoctor, setOpenViewDoctor] = useState(false);
  const [dataDetailDoctor, setDataDetailDoctor] = useState(null);
  const [openCreateDoctor, setOpenCreateDoctor] = useState(false);
  const [dataUpdateDoctor, setDataUpdateDoctor] = useState(null);
  const [openUpdateDoctor, setOpenUpdateDoctor] = useState(false);

  //State Search doctor
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");

  const navigator = useNavigate();

  //Effect
  useEffect(() => {
    fetchListDoctor();
  }, [currentPage, pageSize, firstName, lastName, address]);

  const fetchListDoctor = async () => {
    setLoadingTable(true);
    let query = `page=${currentPage}&limit=${pageSize}`;

    // Tham số tìm kiếm
    if (firstName) {
      query += `&firstName=${encodeURIComponent(firstName)}`;
    }
    if (lastName) {
      query += `&lastName=${encodeURIComponent(lastName)}`;
    }
    if (address) {
      query += `&address=${encodeURIComponent(address)}`;
    }

    const res = await fetchAllDoctor(query);
    console.log("res doctor: ", res);
    if (res && res.data) {
      setDataDoctor(res.data);
      setTotalDoctors(res.totalDoctors);
    }
    setLoadingTable(false);
  };

  //Function
  const handleDeleteDoctor = async (id) => {
    const res = await deleteDoctor(id);
    if (res) {
      notification.success({
        message: "Xóa thông tin bác sĩ",
        description: "Bạn đã xoá thành công",
      });
      await fetchListDoctor();
    } else {
      notification.error({
        message: "Xoá tài khoản user",
        description: JSON.stringify(res.message),
      });
    }
  };

  const onChangePagination = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const cancelXoa = (e) => {
    console.log(e);
    message.error("Huỷ xoá");
  };

  const notificationContent = () => (
    <div>
      <span>Lịch trình khám bệnh của bác sĩ hiện chưa có! Bấm vào đây để</span>
      <Button
        type="link"
        style={{ marginLeft: "8px" }}
        onClick={() => {
          navigator("/admin/ke-hoach-doctor");
          console.log("Thêm lịch trình!");
        }}>
        Thêm lịch trình
      </Button>
    </div>
  );

  return (
    <>
      <AdminLayout
        pageTitle="Quản lý bác sĩ"
        setFirstName={setFirstName}
        setLastName={setLastName}
        setAddress={setAddress}
        placeholder={"Tìm kiếm doctor ở đây..."}>
        <Row>
          <Col span={24} style={{ padding: "0 0 20px", fontSize: "18px" }}>
            <span style={{ fontWeight: "500", color: "navy" }}>
              THÔNG TIN BÁC SĨ
            </span>
            <Space size={10} style={{ float: "right" }}>
              <Button
                type="primary"
                icon={<IoAddOutline size={20} />}
                className="custom-row"
                onClick={() => {
                  setOpenCreateDoctor(true);
                }}>
                Thêm bác sĩ
              </Button>
              <Button icon={<FaFileExport size={15} />} className="custom-row">
                Export
              </Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col xs={24} sm={12} md={24} span={24}>
            <Table
              dataSource={dataDoctor}
              loading={loadingTable}
              pagination={false}
              scroll={{ x: "max-content" }}
              rowClassName="custom-row"
              headerClassName="custom-header"
              rowKey="_id">
              <Column
                title={<p className="title-col-style">STT</p>}
                dataIndex="stt"
                key="stt"
                render={(_, record, index) => {
                  return <>{index + 1 + (currentPage - 1) * pageSize}</>;
                }}
              />
              <Column
                title={<p className="title-col-style">Image</p>}
                dataIndex="image"
                key="image"
                render={(text) => {
                  const imageUrl = `${
                    import.meta.env.VITE_BACKEND_URL
                  }/uploads/${text}`;
                  return (
                    <img
                      src={imageUrl}
                      alt={`doctor ${text}`}
                      style={{
                        width: 70,
                        height: 70,
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "1px solid navy",
                      }}
                    />
                  );
                }}
              />
              <Column
                title={<p className="title-col-style">Email</p>}
                dataIndex="email"
                key="email"
              />
              <ColumnGroup title={<p className="title-col-style">Họ và Tên</p>}>
                <Column
                  title={<p className="title-col-style">Họ</p>}
                  dataIndex="lastName"
                  key="lastName"
                />
                <Column
                  title={<p className="title-col-style">Tên</p>}
                  dataIndex="firstName"
                  key="firstName"
                />
              </ColumnGroup>
              <Column
                title={<p className="title-col-style">Địa chỉ</p>}
                dataIndex="address"
                key="address"
                width={200}
              />

              <Column
                title={<p className="title-col-style">Ngày chỉnh sửa</p>}
                dataIndex="updatedAt"
                key="updatedAt"
                render={(text) => (
                  <>
                    {moment(text).format("DD/MM/YYYY")}
                    <br />
                    {moment(text).format("HH:mm:ss")}
                  </>
                )}
                width={200}
              />
              <Column
                title={<p className="title-col-style">Chức năng</p>}
                key="action"
                render={(_, record) => (
                  <Space size="middle">
                    <EyeOutlined
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        console.log("record: ", record);
                        if (record.thoiGianKham.length > 0) {
                          setOpenViewDoctor(true);
                          setDataDetailDoctor(record);
                        } else {
                          notification.error({
                            message: `Không thể xem thông tin chi tiết của bác sĩ: ${record.lastName} ${record.firstName}`,
                            description: notificationContent(),
                          });
                        }
                      }}
                    />

                    <EditOutlined
                      style={{ color: "orange" }}
                      onClick={() => {
                        console.log("record update: ", record);
                        setOpenUpdateDoctor(true);
                        setDataUpdateDoctor(record);
                      }}
                    />

                    <Popconfirm
                      title={`xóa tài khoản`}
                      description="Bạn có chắc chắn muốn xoá?"
                      onConfirm={() => handleDeleteDoctor(record._id)}
                      onCancel={cancelXoa}
                      okText="Xác nhận xoá"
                      cancelText="Không Xoá">
                      <DeleteOutlined style={{ color: "red" }} />
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
                margin: "10px 0 20px 0",
              }}
              current={currentPage}
              pageSize={pageSize}
              total={totalDoctors}
              onChange={(page, pageSize) => onChangePagination(page, pageSize)}
              showSizeChanger={true}
              showQuickJumper={true}
              showTotal={(total, range) => (
                <div>
                  {range[0]}-{range[1]} trên {total} tài khoản
                </div>
              )}
              locale={{
                items_per_page: "dòng / trang",
                jump_to: "Đến trang số",
                jump_to_confirm: "Xác nhận",
                page: "",
              }}
            />

            <ViewDoctor
              openViewDoctor={openViewDoctor}
              setOpenViewDoctor={setOpenViewDoctor}
              dataDetailDoctor={dataDetailDoctor}
              setDataDetailDoctor={setDataDetailDoctor}
              fetchListDoctor={fetchListDoctor}
            />

            <CreateDoctor
              openCreateDoctor={openCreateDoctor}
              setOpenCreateDoctor={setOpenCreateDoctor}
              fetchListDoctor={fetchListDoctor}
            />

            <UpdateDoctor
              dataUpdateDoctor={dataUpdateDoctor}
              setDataUpdateDoctor={setDataUpdateDoctor}
              openUpdateDoctor={openUpdateDoctor}
              setOpenUpdateDoctor={setOpenUpdateDoctor}
              fetchListDoctor={fetchListDoctor}
            />
          </Col>
        </Row>
      </AdminLayout>
    </>
  );
};

export default QuanLyDoctor;
