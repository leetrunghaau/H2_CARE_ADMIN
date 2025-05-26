import Footer from "../../components/TrangChu/Footer/Footer"
import HeaderViewDoctor from "../../components/TrangChu/Header/HeaderViewDoctor"
import Header from "../../components/TrangChu/Header/Header"
import '../TrangChu/home.scss'
import BodyHomePage from "./BodyHomePage/BodyHomePage"
const Home = () => {

    return (
        <>
            <div className='layout-app'>
                {/* <Header /> */}
                <HeaderViewDoctor />
                <BodyHomePage />
                <Footer />
            </div>            
        </>
    )
}
export default Home