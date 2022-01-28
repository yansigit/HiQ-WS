import styles from './layout.module.css'
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

export const siteTitle = 'HiQ-WS'

export default function Layout({ children, user }) {
    return (
        <div className={`container-fluid ${styles.layoutBody}`}>
            <Header className='row' />
            <div className="row m-0 py-3 justify-content-center">
                <Sidebar className={`col-lg-3 ${styles.sideBar}`} user={user} />
                <main className={`col-lg pt-sm-3 pt-md-0 ${styles.main}`}>
                    {children}
                </main>
            </div>
            <Footer className={`row mt-auto ${styles.footer}`} />
        </div>
    )
}