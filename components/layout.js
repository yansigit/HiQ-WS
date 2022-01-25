import styles from './layout.module.css'
import Link from 'next/link'
import Sidebar from "./sidebar";
import Header from "./header";
import Footer from "./footer";

export const siteTitle = 'HiQ-WS'

export default function Layout({ children, home, user }) {
    return (
        <body className={`d-flex flex-column min-vh-100 ${styles.body}`}>
            <Header />
            <div className={`d-flex flex-row ${styles.container}`}>
                <Sidebar user={user} />
                <main className="p-3 w-100">{children}</main>
                {!home && (
                    <div>
                        <Link href="/">
                            <a>← Back to home</a>
                        </Link>
                    </div>
                )}
            </div>
            <Footer className={`mt-auto ${styles.footer}`} />
        </body>
    )
}