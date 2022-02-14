import styles from './sidebar.module.css'
import Image from "next/image";
import SettingIcon from '../public/setting.gif'
import {useEffect} from "react";

export default function Sidebar({user, className}) {
    const {EMAIL, ROLE, COMPANY, NAME, POSITION, SHIPS} = user

    const ShipList = ({ships}) => {
        let i = 1
        return ships.map(e => <a key={`shipList${i++}`} href="#" className="text-white">{e.SHIPNAME}</a>)
    }

    return (
        <div className={`${className} text-white`}>
            <div className={`card mb-3 rounded-0 shadow-sm text-white ${styles.user_info}`}>
                <div className="card-body">
                    <div className="d-flex flex-row align-items-center">
                        <Image src="https://picsum.photos/100/100" width="70" height="70" className="rounded-circle" />
                        <div className="d-flex flex-column w-100 justify-content-center align-items-center">
                            <span><strong>{COMPANY}</strong></span>
                            <span>{NAME}</span>
                            <span><em>{POSITION}</em></span>
                        </div>
                        <Image src={SettingIcon} />
                    </div>
                    <hr />
                    <div className="d-flex flex-column text-center">
                        <span className="h6">My Ships</span>
                        <div className="d-flex flex-column">
                            <ShipList ships={SHIPS} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={`card rounded-0 shadow-sm text-black bg-white`}>
                <div className="card-header text-center fw-bold">
                    Important Logs
                </div>
                <div className="card-body">
                    <div className={`list-group rounded-0 ${styles.log_box}`}>
                        <a href="#" className="list-group-item list-group-item-action p-2 text-danger">[ALERT] Neque porro quisquam est qui dolorem ipsum quia </a>
                        <a href="#" className="list-group-item list-group-item-action p-2 text-danger">[NOTICE] Vestibulum ante ipsum primis in faucibus</a>
                        <a href="#" className="list-group-item list-group-item-action p-2 text-danger">[ALERT] dolor nisi auctor mi, vitae pulvinar nunc eros at</a>
                        <a href="#" className="list-group-item list-group-item-action p-2 text-danger">[ALERT] ullamcorper justo. Vivamus quis erat pharetra</a>
                        <a href="#" className="list-group-item list-group-item-action p-2 text-danger">[NOTICE] Maecenas posuere dignissim tempor</a>
                    </div>
                    <button className="btn btn-light w-100 mt-2">More</button>
                </div>
            </div>
        </div>
    )
}
