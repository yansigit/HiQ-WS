import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import 'chart.js/auto'
import {Chart} from "react-chartjs-2";
import styles from './index.module.css'
import utilStyles from '../styles/utils.module.css'
import {forwardRef, useEffect, useState} from "react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import {useRouter} from "next/router";
import {getUserFromToken, tokenMiddleWare} from "../lib/token";
import Link from "next/link";
import Error from '../components/error'
import Cookies from "cookies";

export default function Home({redirectToLogin, user}) {
    const COLORS = ['#4c4cdb', '#9371e0', '#e071a2']
    const [ship, setShip] = useState('SHIP-A')
    const [startDate, setStartDate] = useState(new Date());
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(24)
    const [isTable, setIsTable] = useState(true)

    const router = useRouter()

    if(redirectToLogin) {
        const button = <Link href="/user/login">
            <a className="btn btn-danger">로그인</a>
        </Link>

        return <Error title="오류" message="로그인이 필요한 페이지입니다" customTag={button} />
    }

    const DatePickerButton = forwardRef(({value, onClick}, ref) => (
        <button className="btn btn-primary" onClick={onClick} ref={ref}>
            {value}
        </button>
    ));

    const GenerateTableRows = () => {
        return [...Array(20).keys()].map(e => {
            return <tr>
                <td>{e+1}</td>
                <td>{new Date().getTime()}</td>
                <td>10</td>
                <td>20</td>
                <td>30</td>
                <td>40</td>
                <td>50</td>
            </tr>
        });
    }

    return (
        <Layout user={user} home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <div className="d-flex flex-column justify-content-center">
                {/* 컨트롤들 */}
                <div
                    className={`d-flex flex-row justify-content-start align-items-center bg-dark mb-3 p-2 ${utilStyles.bd_darkblue} shadow-sm`}>
                    <div className="dropdown">
                        <a className="btn btn-secondary dropdown-toggle me-2" href="#" role="button"
                           id="dropdownMenuLink"
                           data-bs-toggle="dropdown" aria-expanded="false">
                            {ship}
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li><a className="dropdown-item" href="#" onClick={() => {
                                setShip('SHIP-A')
                            }}>SHIP-A</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => {
                                setShip('SHIP-B')
                            }}>SHIP-B</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => {
                                setShip('SHIP-C')
                            }}>SHIP-C</a></li>
                        </ul>
                    </div>
                    {/* 날짜 선택 */}
                    <div className="me-2">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            customInput={<DatePickerButton />}
                        />
                    </div>
                    {/* 시작 시간 선택 */}
                    <div className="dropdown me-2">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                            {startTime}:00
                        </button>
                        <ul className={`dropdown-menu ${styles.time_ul}`} aria-labelledby="dropdownMenuButton1">
                            {[...Array(24).keys()].map(e => (
                                <li key={`start_time_item_${e + 1}`}><small className="dropdown-item" onClick={() => setStartTime(e+1)}>{e + 1}:00</small></li>
                            ))}
                        </ul>
                    </div>
                    <span className="text-white">~</span>
                    {/* 시작 시간 선택 */}
                    <div className="dropdown mx-2">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1"
                                data-bs-toggle="dropdown" aria-expanded="false">
                            {endTime}:00
                        </button>
                        <ul className={`dropdown-menu ${styles.time_ul}`} aria-labelledby="dropdownMenuButton1">
                            {[...Array(24).keys()].map(e => (
                                <li key={`end_time_item_${e + 1}`}><small className="dropdown-item" onClick={() => setEndTime(e+1)}>{e + 1}:00</small></li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-100" />
                    {/* 보이기 체크 */}
                    <button className="btn btn-warning" onClick={() => setIsTable(!isTable)}>{isTable ? "Table" : "Chart"}</button>
                </div>
                {/* 그래프 */}
                <div className={`card rounded-0 shadow-sm ${styles.graph_box} ${isTable ? "d-none" : null}`}>
                    <div className={`card-header text-center fw-bold ${utilStyles.text_darkblue}`}>
                        Current {ship} Status Chart
                    </div>
                    <div className="card-body">
                        <Chart
                            type='line'
                            data={{
                                labels: ['sun', 'mon', 'tue', 'wed', 'thur', 'fri', 'sat'],
                                datasets: [0, 1, 2].map(e => ({
                                    label: 'Temp' + e,
                                    data: [Math.round(Math.random() * 200), Math.round(Math.random() * 200), Math.round(Math.random() * 200),
                                        Math.round(Math.random() * 200), Math.round(Math.random() * 200), Math.round(Math.random() * 200), Math.round(Math.random() * 200)],
                                    fill: false,
                                    borderColor: COLORS[e],
                                    tension: 0.1
                                }))
                            }}
                            options={{maintainAspectRatio: false}}
                        />
                    </div>
                </div>
                {/* 테이블 */}
                <div className={`card shadow-sm ${!isTable ? "d-none" : null}`}>
                    <div className="card-header fw-bold text-center">
                        Current {ship} Status Table
                    </div>
                    <div className="card-body">
                        <table className="table table-striped table-hover">
                            <thead>
                            <tr>
                                <th>Ship Id</th>
                                <th>Time</th>
                                <th>C1</th>
                                <th>C2</th>
                                <th>C3</th>
                                <th>C4</th>
                                <th>C5</th>
                            </tr>
                            </thead>
                            <tbody>
                            <GenerateTableRows />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export async function getServerSideProps({req, res}) {

    const {cookies: {accessToken, refreshToken}} = req

    if (!accessToken) {
        return {
            props: {redirectToLogin: true}
        }
    }

    const cookies = new Cookies(req, res)
    const user = tokenMiddleWare(accessToken, refreshToken, cookies)

    return {
        props: {user}
    }
}
