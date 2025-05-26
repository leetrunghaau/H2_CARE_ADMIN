import MenuNav from "./Menu/Menu";
import BodyAdmin from "./BodyAdmin/BodyAdmin";
import { Container, Navbar } from "react-bootstrap";
import { useDispatch } from "react-redux";

const AdminLayout = ({
  children,
  pageTitle,
  placeholder,
  setFirstName,
  setLastName,
  setAddress,
  setTenChucVu,
  setTenPK,
  setAddressPK,
  setTenCK,
  setLichHen,
}) => {
  const dispatch = useDispatch();

  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <div
          style={{
            height: 250,
            backgroundColor: "#0d73db",
            marginTop: 0,
            padding: 0,
          }}>
          <MenuNav />
          <BodyAdmin
            content={children}
            pageTitle={pageTitle}
            setFirstName={setFirstName || (() => {})}
            setLastName={setLastName || (() => {})}
            setAddress={setAddress || (() => {})}
            setTenChucVu={setTenChucVu || (() => {})}
            setTenPK={setTenPK || (() => {})}
            setAddressPK={setAddressPK || (() => {})}
            setTenCK={setTenCK || (() => {})}
            setLichHen={setLichHen || (() => {})}
            placeholder={placeholder}
          />
        </div>
      </Container>
    </Navbar>
  );
};

export default AdminLayout;
