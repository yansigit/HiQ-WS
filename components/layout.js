import styles from './layout.module.css'
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";
import patternBg from '../public/45-degree-fabric-light.png'

export const siteTitle = 'HiQ-WS'

export default function Layout({ children, user }) {
    return (
        <div className={`container-fluid d-flex flex-column vh-100 bg-dark ${styles.layoutBody}`} style={{backgroundImage: `url(${patternBg.src})`}} >
            <Header className='row' />
            <div className={`row m-0 py-3 justify-content-center ${styles.mainBox}`}>
                <Sidebar className={`col-lg-3 px-xl-4 ${styles.sideBar}`} user={user} />
                <main className={`col-lg-9 pt-sm-3 pt-md-0 ${styles.main}`}>
                    {children}
                </main>
            </div>
            <Footer className={`row h-100 ${styles.footer}`} />
        </div>
    )
}
