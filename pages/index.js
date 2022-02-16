import Head from 'next/head'
import React from "react";
import Layout, {siteTitle} from '../components/layout'
import 'chart.js/auto'
import {forwardRef, useEffect, useRef, useState} from "react";
import 'react-datepicker/dist/react-datepicker.css'
import {getUserFromToken, tokenMiddleWare} from "../lib/token";
import Link from "next/link";
import Error from '../components/error'
import Cookies from "cookies";
import {gql} from "@apollo/client";
import client from "./apollo-client";
import {useRouter} from "next/router";
import {GraphBox, TableBox, SettingBar} from "../components/dashboard";
import {useRecoilState, useRecoilValue} from "recoil";
import {chartHtmlLegends, chartLabelState} from "../states/states";
import {generateDarkColorHex} from "../lib/common";

export default function Home({redirectToLogin, user}) {
    // Router
    const router = useRouter()

    // Init
    if (redirectToLogin) {
        const button = <Link href="/user/login">
            <a className="btn btn-danger">Login</a>
        </Link>

        return <Error title="ERROR" message="You are not authorized to access this page." customTag={button}/>
    }
    if (user.SHIPS[0].HULLNUM == null) {
        const button = <button onClick={async () => {
            await fetch('/api/logout')
            await router.replace('/user/login')
        }} className="btn btn-danger">Logout</button>

        return <Error title="WARNING" message="Your account doesn't have any ship. Please contact to admin."
                      customTag={button}/>
    }

    // States
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
    const [isGraphDisplayPercentage, setGraphDisplayPercentage] = useState(true)
    const [_forceUpdate, forceUpdater] = useState(0)
    const [selectedColumns, setSelectedColumns] = useState(['HULLNUM', 'TIME'])
    const chartPointNumberRef = useRef()
    const htmlLegendRef = useRef()
    const chartJsInstanceRef = useRef()

    useEffect(async () => {
        await modifyOnClick()
        chartPointNumberRef.current ? chartPointNumberRef.current.focus() : null
    }, [ship, preset, startDate, isGraphDisplayPercentage, _forceUpdate, chartPointNumber])


    // Methods
    const modifyOnClick = async () => {
        if ((endTime.hh + endTime.mm) - (startTime.hh + startTime.mm) < 0) {
            alert("Invalid time range")
            setStartTime({hh: "00", mm: "00"})
            setEndTime({hh: "00", mm: "00"})
            setStartTimeFlag(true)
            setEndTimeFlag(true)
            return
        }
        const _startDate = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate()
        // const _endDate = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate()
        const formattedStartTime = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${_startDate} ${startTime.hh}:${startTime.mm}:00`
        // const formattedEndTime = `${endDate.getFullYear()}-${endDate.getMonth()+1}-${_endDate} 02:15:00`
        const formattedEndTime = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${_startDate} ${endTime.hh}:${endTime.mm}:00`

        let {data: {getGraphs}} = await client.query({
            query: gql`
                query Query($hullNum: Int!, $startTime: String!, $endTime: String!, $preset: String!) {
                    getGraphs(hullNum: $hullNum, startTime: $startTime, endTime: $endTime, preset: $preset) {
                        ${PRESETS[preset]}
                    }
                }
            `,
            variables: {
                hullNum: ship,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                preset
            }
        })

        if (!getGraphs)
            getGraphs = []

        setGraphData(getGraphs)
        setLabels(getGraphs.map(g => new Date(g.TIME).toTimeString().split(' ')[0]))
    }
    const getGraphDataInPercentage = (e) => {
        // 1. reduce dataset and append the latest data
        // 2. get the designated data if the data is not null
        const data = graphData.filter((_, i) => i % Math.ceil(labels.length / chartPointNumber) === 0)
            .map(g => g ? g[e] : null)

        // if all data == null
        if (data.filter(e => e != null).length === 0) {
            return data
        }

        const [min, max] = [Math.min(...data), Math.max(...data)]
        if (min === max)
            return new Array(data.length).fill(0)
        return data.map(d => (d - min) / (max - min) * 100)
    }

    // Constraints
    const AllColumns = ['HULLNUM', 'TIME', 'AIT_1121', 'AIT_1122', 'AIT_1123', 'AIT_151', 'AIT_251', 'AIT_351', 'AP_LVL_01', 'CT_1111',
        'CT_1751', 'FCV_1131_CMD', 'FCV_1131_FD', 'FCV_1211_CMD', 'FCV_1211_FD', 'FCV_1751_CMD', 'FCV_1751_FD', 'FCV_3131_CMD',
        'FCV_3131_FD', 'FCV_3211_CMD', 'FCV_3211_FD', 'FIT_1131', 'FIT_1211', 'FIT_2131', 'FIT_2211', 'FIT_3131', 'FIT_3211',
        'GPS_LAT', 'GPS_LON', 'LIT_1311', 'PIT_1211', 'PIT_1212', 'PIT_2211', 'PIT_2212', 'PIT_3211', 'PIT_3212', 'PT_1121', 'PT_1721',
        'PT_1722', 'P_132_CMD', 'P_132_FD', 'P_232_CMD', 'P_232_FD', 'P_332_CMD', 'P_332_FD', 'REC1017', 'REC1018', 'REC1019', 'REC1020',
        'REC1021', 'REC1027', 'REC1028', 'REC1029', 'REC1030', 'REC1031', 'REC1043', 'REC2017', 'REC2018', 'REC2019', 'REC2020',
        'REC2021', 'REC2027', 'REC2028', 'REC2029', 'REC2030', 'REC2031', 'REC2043', 'REC3017', 'REC3018', 'REC3019', 'REC3020',
        'REC3021', 'REC3027', 'REC3028', 'REC3029', 'REC3030', 'REC3031', 'REC3043', 'REC4017', 'REC4018', 'REC4019', 'REC4020',
        'REC4021', 'REC4027', 'REC4028', 'REC4029', 'REC4030', 'REC4031', 'REC4043', 'TE_1111', 'REC1000', 'REC2000', 'REC3000', 'REC4000']
    const PRESETS = {
        Custom: AllColumns,
        Ballasting: ['HULLNUM', 'TIME', 'AIT_151', 'AIT_251', 'AIT_351', 'FIT_1211', 'FIT_2211',
            'FIT_3211', 'FIT_1131', 'FIT_2131', 'FIT_3131', 'REC1017',
            'REC1018', 'REC2017', 'REC2018', 'REC3017', 'REC3018', 'REC4017', 'REC4018',
            'PIT_1211', 'PIT_1212', 'PIT_2211', 'PIT_2212', 'PIT_3211',
            'PIT_3212', 'CT_1111', 'TE_1111', 'REC1000', 'REC2000', 'REC3000', 'REC4000'],
        Deballasting: ['HULLNUM', 'TIME', 'AIT_151', 'AIT_251', 'AIT_351', 'FIT_1211', 'FIT_2211', 'FIT_3211', 'LIT_1311', 'P_132_FD', 'P_232_FD', 'P_332_FD'],
    }
    const [COLORS, _] = useState(AllColumns.reduce((o, key) => ({
        ...o,
        [key]: generateDarkColorHex()
    }), {}))
    const SETTING_BAR_PROPS = {
        setShip, ship, user, setPreset, PRESETS, preset,
        setStartTime, startTime, startTimeFlag, setStartTimeFlag,
        setEndTime, endTime, endTimeFlag, setEndTimeFlag, setIsTable, isTable, modifyOnClick,
        startDate, setStartDate
    }

    const HTMLLegend = ({chartRef, isChart}) => {
        console.log('render')
        return isChart ? <div className="card mt-3">
            <div className="card-body p-1 text-center" ref={htmlLegendRef}>
                {chartRef.current.legend.legendItems.map(i => {
                    const [isVisible, setVisible] = useState(chartRef.current.isDatasetVisible(i.datasetIndex))
                    return <button className="btn"
                                   style={{backgroundColor: isVisible ? i.strokeStyle : '#999', color: 'white', margin: '2px', font: 'menu'}}
                                   onClick={() => {
                                       chartRef.current.setDatasetVisibility(i.datasetIndex, !isVisible);
                                       chartRef.current.update()
                                       setVisible(chartRef.current.isDatasetVisible(i.datasetIndex))
                                   }}>{i.text}</button>;
                })}
            </div>
        </div> : <></>
    }

    return (
        <Layout user={user}>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <SettingBar options={SETTING_BAR_PROPS} />
            <TableBox className={isTable ? '' : 'd-none'} graphData={graphData} PRESETS={PRESETS} preset={preset}/>
            <GraphBox className={!isTable ? '' : 'd-none'} preProcessor={getGraphDataInPercentage}
                      graphRef={chartJsInstanceRef}
                      goLeftFunc={async () => {
                          parseInt(startTime.hh) > 0 ? setStartTime({
                              hh: (parseInt(startTime.hh) - 1).toString(),
                              mm: startTime.mm
                          }) : null
                          parseInt(endTime.hh) > 1 ? setEndTime({
                              hh: (parseInt(endTime.hh) - 1).toString(),
                              mm: endTime.mm
                          }) : null
                          forceUpdater(_forceUpdate + 1)
                      }}
                      goRightFunc={async () => {
                          parseInt(startTime.hh) < 22 ? setStartTime({
                              hh: (parseInt(startTime.hh) + 1).toString(),
                              mm: startTime.mm
                          }) : null
                          parseInt(endTime.hh) < 23 ? setEndTime({
                              hh: (parseInt(endTime.hh) + 1).toString(),
                              mm: endTime.mm
                          }) : null
                          forceUpdater(_forceUpdate + 1)
                      }}
                      excludeFunc={e => e !== 'HULLNUM' && e !== 'TIME'}
                      setGraphDisplayPercentage={setGraphDisplayPercentage}
                      isGraphDisplayPercentage={isGraphDisplayPercentage}
                      chartPointNumber={chartPointNumber}
                      chartPointNumberRef={chartPointNumberRef}
                      setChartPointNumber={setChartPointNumber}
                      PRESETS={PRESETS}
                      preset={preset}
                      labels={labels}
                      COLORS={COLORS}
                      graphData={graphData}
                      selectedColumns={selectedColumns.filter(c => c !== 'HULLNUM' && c !== 'TIME')}
            />
            <HTMLLegend chartRef={chartJsInstanceRef} isChart={!isTable} preset={preset} />
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
