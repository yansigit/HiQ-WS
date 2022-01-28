import Image from "next/image";
import Logo from "../public/logo.png"
import styles from './header.module.css'

export default function Header({className}) {
    return (
        <header className={`${className}`}>
            <div className={`px-3 py-2 text-white ${styles.top_header}`}>
                <div className="container">
                    <div
                        className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                        <a href="/"
                           className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                            <Image src={Logo} />
                        </a>

                        <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                            <li>
                                <a href="#" className="nav-link text-white">

                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link text-white">

                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link text-white">

                                    Orders
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link text-white">

                                    Products
                                </a>
                            </li>
                            <li>
                                <a href="#" className="nav-link text-white">

                                    Customers
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    )
}