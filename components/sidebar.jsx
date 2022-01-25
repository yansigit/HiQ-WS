import styles from './sidebar.module.css'
import Image from "next/image";
import SettingIcon from '../public/setting.gif'

export default function Sidebar({user: {company, name, position, ships}}) {

    const ShipList = ({ships}) => {
        return ships.map(e => <a href="#" className="text-white">{e.name}</a>)
    }

    return (
        <div className={`d-flex flex-column flex-shrink-0 p-3 text-white ${styles.sidebar}`}>
            <div className={`card mb-4 rounded-0 shadow-sm text-white ${styles.user_info}`}>
                <div className="card-body">
                    <div className="d-flex flex-row align-items-center">
                        <Image src="https://picsum.photos/100/100" width="70" height="70" className="rounded-circle" />
                        <div className="d-flex flex-column w-100 justify-content-center align-items-center">
                            <span><strong>{company}</strong></span>
                            <span>{name}</span>
                            <span><em>{position}</em></span>
                        </div>
                        <Image src={SettingIcon} />
                    </div>
                    <hr />
                    <div className="d-flex flex-column text-center">
                        <span className="h6">My Ships</span>
                        <div className="d-flex flex-column">
                            <ShipList ships={ships} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`card mb-4 rounded-0 shadow-sm text-black bg-white`}>
                <div className="card-header text-center fw-bold">
                    Important Logs
                </div>
                <div className="card-body">
                    <ul className={`list-group rounded-0 ${styles.log_box}`}>
                        <li className="list-group-item p-2 text-danger">[ALERT] Neque porro quisquam est qui dolorem ipsum quia </li>
                        <li className="list-group-item p-2 text-danger">[NOTICE] Vestibulum ante ipsum primis in faucibus</li>
                        <li className="list-group-item p-2 text-danger">[ALERT] dolor nisi auctor mi, vitae pulvinar nunc eros at</li>
                        <li className="list-group-item p-2 text-danger">[ALERT] ullamcorper justo. Vivamus quis erat pharetra</li>
                        <li className="list-group-item p-2 text-danger">[NOTICE] Maecenas posuere dignissim tempor</li>
                    </ul>
                    <button className="btn btn-light w-100 mt-2">More</button>
                </div>
            </div>
        </div>
    )
}