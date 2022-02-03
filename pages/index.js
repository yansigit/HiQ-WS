import Head from 'next/head'
import Layout, {siteTitle} from '../components/layout'
import 'chart.js/auto'
import {Chart} from "react-chartjs-2";
import styles from './index.module.css'
import utilStyles from '../styles/utils.module.css'
import {forwardRef, useEffect, useState} from "react";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'
import {getUserFromToken, tokenMiddleWare} from "../lib/token";
import Link from "next/link";
import Error from '../components/error'
import Cookies from "cookies";
import {gql} from "@apollo/client";
import client from "./apollo-client";
import CsvDownload from 'react-json-to-csv'
import {useRouter} from "next/router";

export default function Home({redirectToLogin, user}) {
    const router = useRouter()

    if (redirectToLogin) {
        const button = <Link href="/user/login">
            <a className="btn btn-danger">Login</a>
        </Link>

        return <Error title="ERROR" message="You are not authorized to access this page." customTag={button} />
    }

    if (user.SHIPS[0].HULLNUM == null) {
        const button = <button onClick={async () => {
            await fetch('/api/logout')
            await router.replace('/user/login')
        }} className="btn btn-danger">Logout</button>

        return <Error title="WARNING" message="Your account doesn't have any ship. Please contact to admin." customTag={button} />
    }

    const [ship, setShip] = useState(user.SHIPS[0].HULLNUM)
    const [startDate, setStartDate] = useState(new Date());
    // const [endDate, setEndDate] = useState(new Date());

    const [preset, setPreset] = useState('Deballasting')

    const [startTime, setStartTime] = useState({hh: '00', mm: '00'})
    const [startTimeFlag, setStartTimeFlag] = useState(true)
    const [endTime, setEndTime] = useState({hh: '00', mm: '00'})
    const [endTimeFlag, setEndTimeFlag] = useState(true)

    const [isTable, setIsTable] = useState(true)
    const [graphData, setGraphData] = useState([])

    const [labels, setLabels] = useState([])
    const [chartPointNumber, setChartPointNumber] = useState(100)

    const PRESETS = {
        Ballasting: ['AIT_151', 'AIT_251', 'AIT_351', 'FIT_1211', 'FIT_2211',
            'FIT_3211', 'FIT_1131', 'FIT_2131', 'FIT_3131', 'REC1017',
            'REC1018', 'REC2017', 'REC2018', 'REC3017', 'REC3018', 'REC4017', 'REC4018',
            'PIT_1211', 'PIT_1212', 'PIT_2211', 'PIT_2212', 'PIT_3211',
            'PIT_3212', 'CT_1111', 'TE_1111', 'REC1000', 'REC2000', 'REC3000', 'REC4000'],
        Deballasting: ['AIT_151', 'AIT_251', 'AIT_351', 'FIT_1211', 'FIT_2211', 'FIT_3211', 'LIT_1311', 'P_132_FD', 'P_232_FD', 'P_332_FD'],
    }

    const [COLORS, _] = useState(PRESETS.Ballasting.reduce((o, key) => ({ ...o, [key]: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)}), {}))

    const DatePickerButton = forwardRef(({value, onClick}, ref) => (
        <button className="btn btn-secondary w-100" onClick={onClick} ref={ref}>
            {value}
        </button>
    ))

    // 0127: useEffect -> plain function
    const modifyOnClick = async () => {
        if ((endTime.hh + endTime.mm) - (startTime.hh + startTime.mm) < 0) {
            alert("Invalid time range")
            setStartTime({hh: "00", mm: "00"})
            setEndTime({hh: "00", mm: "00"})
            setStartTimeFlag(true)
            setEndTimeFlag(true)
            return
        }

        // if (endTime.hh - startTime.hh > 2) {
        //     alert("Too wide time range. please set the range less than 2hours")
        //     const adjustedHour = parseInt(startTime.hh) + 2
        //     setEndTime({hh: adjustedHour < 10 ? '0' + adjustedHour : String(adjustedHour), mm: startTime.mm})
        //     return
        // }

        const _startDate = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()
        // const _endDate = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate()
        const formattedStartTime = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${_startDate} ${startTime.hh}:${startTime.mm}:00`
        // const formattedEndTime = `${endDate.getFullYear()}-${endDate.getMonth()+1}-${_endDate} 02:15:00`
        const formattedEndTime = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${_startDate} ${endTime.hh}:${endTime.mm}:00`

        const {data: {getGraphs}} = await client.query({
            query: gql`
                query Query($hullNum: Int!, $startTime: String!, $endTime: String!) {
                    getGraphs(hullNum: $hullNum, startTime: $startTime, endTime: $endTime) {
                        HULLNUM, TIME,
                        ${PRESETS[preset]}
                    }
                }
            `,
            variables: {
                hullNum: ship,
                startTime: formattedStartTime,
                endTime: formattedEndTime
            }
        })

        // setLabels([...Array(timeDiff).keys()])
        setGraphData(getGraphs)
        setLabels(getGraphs.map(g => g.TIME.split(' ')[1]))
    }

    useEffect(async () => {
        await modifyOnClick();
    }, [ship, preset, startDate])

    const DataTable = () => {
        const GenerateTableRows = () => {
            let i = 1
            return graphData.map(e => {
                const {HULLNUM, TIME, ...DATA} = e
                delete DATA.__typename
                return <tr key={`tableRow${i++}`}>
                    <td>{HULLNUM}</td>
                    <td>{TIME}</td>
                    {Object.keys(DATA).map(e => <td>{DATA[e] ? DATA[e] : 'NULL'}</td>)}
                </tr>
            });
        }

        return <table className="table table-striped table-hover">
            <thead className="text-center">
            <tr>
                <th>Ship Id</th>
                <th>Time</th>
                {PRESETS[preset].map(e => <th key={e}>{e}</th>)}
            </tr>
            </thead>
            <tbody className={`${styles.tableBody}`}>
            <GenerateTableRows/>
            </tbody>
        </table>
    }

    const DropBox = ({defaultValue, setFunction, items, className}) => {
        const GenerateDropboxList = ({items, setFunction}) => {
            let i = 0
            if (typeof items[0] === "object") {
                return items.map(({HULLNUM, SHIPNAME}) => <li key={`shipDropList${i++}`}>
                    <a className="dropdown-item" href="#" onClick={() => {
                        setFunction(HULLNUM)
                    }}>{HULLNUM}</a></li>)
            } else {
                return items.map(e => <li key={`shipDropList${i++}`}>
                    <a className="dropdown-item" href="#" onClick={() => {
                        setFunction(e)
                    }}>{e}</a></li>)
            }
        }

        return <div className={`dropdown ${className}`}>
            <a className="btn btn-secondary dropdown-toggle me-2" href="#" role="button"
               id="dropdownMenuLink"
               data-bs-toggle="dropdown" aria-expanded="false">
                {defaultValue}
            </a>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <GenerateDropboxList items={items} setFunction={setFunction}/>
            </ul>
        </div>
    }

    const TimePicker = ({setTime, timeState, flag, setFlag}) => {
        return <div className="dropdown w-100">
            <button className="btn btn-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton1"
                    data-bs-toggle="dropdown" aria-expanded="false">
                {timeState.hh}:{timeState.mm}
            </button>
            <ul className='dropdown-menu' style={{columns: flag ? 2 : 3}} aria-labelledby="dropdownMenuButton1">
                {flag ? [...Array(24).keys()].map(e => (
                    <li key={`start_time_item_${e}`}>
                        <small className="dropdown-item" onClick={() => {
                            setFlag(!flag)
                            setTime(({mm}) => ({hh: e < 10 ? '0'+e : String(e), mm}));
                        }}>{e}:{timeState.mm}</small>
                    </li>
                )) : [...Array(60).keys()].map(e => (
                    <li key={`start_time_item_${e}`}>
                        <small className="dropdown-item" onClick={() => {
                            setFlag(!flag)
                            setTime(({hh}) => ({hh, mm: e < 10 ? '0'+e : String(e)}))
                        }}>{timeState.hh}:{e < 10 ? '0' + e : e}</small>
                    </li>))}
            </ul>
        </div>
    }

    const getGraphDataInPercentage = (e) => {
        // 1. reduce dataset and append the latest data
        // 2. get the designated data if the data is not null
        const data = [...graphData.filter((_, i) => i % Math.ceil(labels.length/chartPointNumber) === 0), graphData[graphData.length-1]]
            .map(g => g ? g[e] : null)

        // if all data == null
        if (data.filter(e => e != null).length === 0) {
            return data
        }

        const [min, max] = [Math.min(...data), Math.max(...data)]
        if (min === max)
            return new Array(data.length).fill(0)
        return data.map(d => (d-min)/(max-min)*100)
    }

    return (
        <Layout user={user}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            {/* Setting Bar */}
            <div className={`row rounded-1 m-0 my-md-3 mt-lg-0 p-0 bg-dark ${utilStyles.bd_darkblue} shadow-sm`}>
                <div className="col-lg col-xl-6 d-flex flex-row p-0 p-2 justify-content-center">
                    {/* Select Hull Num */}
                    <DropBox setFunction={setShip} items={user.SHIPS} defaultValue={ship} />
                    {/* Select Preset */}
                    <DropBox setFunction={setPreset} items={Object.keys(PRESETS)} defaultValue={preset} />
                    {/* Start Date */}
                    <div className="w-100">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            customInput={<DatePickerButton/>}
                        />
                    </div>
                </div>
                <div className="col-lg d-flex flex-row p-0 p-2 justify-content-center justify-content-md-end justify-content-lg-center">
                    {/* Start Time */}
                    <TimePicker setTime={setStartTime} timeState={startTime} flag={startTimeFlag} setFlag={setStartTimeFlag} />
                    <span className="text-white mx-2">~</span>
                    {/* End Date */}
                    {/*<div className="me-2">*/}
                    {/*    <DatePicker*/}
                    {/*        selected={endDate}*/}
                    {/*        onChange={(date) => setEndDate(date)}*/}
                    {/*        customInput={<DatePickerButton/>}*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/* End Time */}
                    <TimePicker setTime={setEndTime} timeState={endTime} flag={endTimeFlag} setFlag={setEndTimeFlag} />
                </div>
                <div className="col-lg d-flex flex-row p-0 p-2 justify-content-center justify-content-md-end">
                    {/* Switching visibility */}
                    <button className="btn btn-secondary me-2 w-100"
                            onClick={() => setIsTable(!isTable)}>{isTable ? "Table" : "Chart"}</button>
                    <button className="btn btn-primary w-100"
                            onClick={() => modifyOnClick()}>Execute</button>
                </div>
            </div>
            {/* Graph */}
            <div className={`m-0 card rounded-0 shadow-sm p-0 ${styles.graph_box} ${isTable ? "d-none" : null}`}>
                <div className={`card-header text-center fw-bold d-flex flex-row align-items-center ${utilStyles.text_darkblue}`}>
                    <h5 className="m-0 w-100">Chart view (in Percentage)</h5>
                    <input type="number" className={`form-control ${styles.chartInput}`} defaultValue={chartPointNumber} onChange={e => setChartPointNumber(parseInt(e.target.value))} />
                </div>
                <div className="card-body">
                    <Chart
                        type='line'
                        data={{
                            // reduce amount of data then append the latest element
                            labels: [...labels.filter((e, i) => i % Math.ceil(labels.length/chartPointNumber) === 0), labels[labels.length-1]],
                            datasets: PRESETS[preset].map(e => {
                                return ({
                                    label: e,
                                    data: getGraphDataInPercentage(e),
                                    fill: false,
                                    borderColor: COLORS[e],
                                    tension: 0.1
                                });
                            })
                        }}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'right',
                                }
                            }
                    }}
                    />
                </div>
            </div>
            {/* Table */}
            <div className={`m-0 card shadow-sm p-0 ${styles.tableBox} ${!isTable ? "d-none" : null}`}>
                <div className="card-header fw-bold text-center d-flex align-items-center">
                    <h5 className="m-0 w-100">Table view</h5>
                    <CsvDownload className="btn btn-success" data={graphData.map(e => {const {__typename, ...filtered} = e; return filtered})} children="CSV" filename='shipdata.csv' />
                </div>
                <div className="card-body overflow-scroll">
                    <DataTable />
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
    const newAccessToken = tokenMiddleWare(accessToken, refreshToken, cookies)
    const user = getUserFromToken(newAccessToken);

    return {
        props: {user}
    }
}
