import styles from "../pages/index.module.css";
import utilStyles from "../styles/utils.module.css";
import {Chart} from "react-chartjs-2";
import CsvDownload from "react-json-to-csv";
import DatePicker from "react-datepicker";
import {forwardRef, useEffect, useState} from "react";
import React from "react";

export const SettingBar = ({options}) => {
    const {setShip, ship, user, setPreset, PRESETS, preset,
        setStartTime, startTime, startTimeFlag, setStartTimeFlag,
        setEndTime, endTime, endTimeFlag, setEndTimeFlag, setIsTable, isTable, modifyOnClick,
        startDate, setStartDate} = options
    return <div className={`row rounded-1 m-0 my-md-3 mt-lg-0 p-0 bg-dark ${utilStyles.bd_darkblue} shadow-sm`}>
        <div className="col-lg col-xl-6 d-flex flex-row p-0 p-2 justify-content-center">
            {/* Select Hull Num */}
            <DropBox setFunction={setShip} items={user.SHIPS} defaultValue={ship}/>
            {/* Select Preset */}
            <DropBox setFunction={setPreset} items={Object.keys(PRESETS)} defaultValue={preset}/>
            {/* Start Date */}
            <div className="w-100">
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    customInput={<DatePickerButton/>}
                />
            </div>
        </div>
        <div
            className="col-lg d-flex flex-row p-0 p-2 justify-content-center justify-content-md-end justify-content-lg-center">
            {/* Start Time */}
            <TimePicker setTime={setStartTime} timeState={startTime} flag={startTimeFlag}
                        setFlag={setStartTimeFlag}/>
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
            <TimePicker setTime={setEndTime} timeState={endTime} flag={endTimeFlag} setFlag={setEndTimeFlag}/>
        </div>
        <div className="col-lg d-flex flex-row p-0 p-2 justify-content-center justify-content-md-end">
            {/* Switching visibility */}
            <button className="btn btn-secondary me-2 w-100"
                    onClick={() => setIsTable(!isTable)}>{isTable ? "Table" : "Chart"}</button>
            <button className="btn btn-primary w-100"
                    onClick={() => modifyOnClick()}>Execute
            </button>
        </div>
    </div>;
}

export const GraphBox = ({ className, preProcessor, excludeFunc, goLeftFunc, goRightFunc, graphRef,
                                        setGraphDisplayPercentage, isGraphDisplayPercentage, chartPointNumber,
                                        chartPointNumberRef, setChartPointNumber, PRESETS, preset, labels, COLORS, graphData, selectedColumns
                         }) => {
    const dataSets = PRESETS[preset]
    return <div className={`m-0 card rounded-0 shadow-sm p-0 ${styles.graph_box} ${className}`}>
        <div
            className={`m-0 card-header text-center fw-bold row justify-content-end align-items-center ${utilStyles.text_darkblue}`}>
            <button className="col-auto btn btn-primary me-2"
                    onClick={() => setGraphDisplayPercentage(!isGraphDisplayPercentage)}>
                {isGraphDisplayPercentage ? 'Percentage' : 'Plain'}
            </button>
            <input type="number" className={`col-auto form-control ${styles.chartInput}`}
                   defaultValue={chartPointNumber}
                   ref={chartPointNumberRef}
                   onChange={e => {
                       setChartPointNumber(parseInt(e.target.value))
                   }}/>
        </div>
        <div className="card-body p-0">
            <Chart
                type='line'
                ref={graphRef}
                data={{
                    // reduce amount of data
                    labels: labels.filter((e, i) => i % Math.ceil(labels.length / chartPointNumber) === 0),
                    // Set datasets from preset value (Custom or Ballasting or Deballasting)
                    datasets: dataSets.filter(excludeFunc).map(e => {
                        return ({
                            label: e,
                            data: isGraphDisplayPercentage ? preProcessor(e) : graphData.filter((_, i) => i % Math.ceil(labels.length / chartPointNumber) === 0).map(g => g ? g[e] : null),
                            fill: false,
                            borderColor: COLORS[e],
                            tension: 0.1,
                            hidden: preset === 'Custom'
                        });
                    })
                }}
                options={{
                    maintainAspectRatio: false,
                    layout: {
                        padding: 5
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                            align: 'start',
                            labels: {
                                padding: 10
                            }
                        }
                    }
                }}
            />
        </div>
        <div className="card-footer text-center">
            <button className="btn btn-secondary me-1" onClick={goLeftFunc}>◀</button>
            <button className="btn btn-secondary ms-1" onClick={goRightFunc}>▶</button>
        </div>
    </div>;
}

export const TableBox = ({graphData, PRESETS, preset, className}) => {
    const [page, setPage] = useState(1)
    return <div className={`m-0 card shadow-sm p-0 ${styles.tableBox} ${className}`}>
        <div className={`card-header fw-bold text-center d-flex align-items-center p-1`}>
            <span className="m-0 w-100">Table view</span>
            <CsvDownload className="btn btn-success" data={graphData.map(e => {
                const {__typename, ...filtered} = e;
                return filtered
            })} children="CSV" filename='shipdata.csv'/>
        </div>
        <div className="card-body overflow-scroll p-0">
            <DataTable graphData={graphData} PRESETS={PRESETS} preset={preset} page={page}/>
        </div>
        <div className="card-footer p-1 d-flex justify-content-center align-items-center">
            <button className="btn p-1 mx-1" onClick={() => page > 1 ? setPage(page-1) : null}>◀</button>
            <input type="text" pattern="[0-9]" className="text-center" size="1" value={page} onChange={(e) => {
                const page = parseInt(e.target.value)
                if (!isNaN(page))
                    setPage(page);
            }} />
            <button className="btn p-1 mx-1" onClick={() => setPage(page+1)}>▶</button>
        </div>
    </div>;
}

const DataTable = ({graphData, PRESETS, preset, page}) => {
    const GenerateTableRows = () => {
        let [i, j] = [1, 1]
        return graphData.slice((page-1)*30, page*30).map(e => {
            const {HULLNUM, TIME, ...DATA} = e
            delete DATA.__typename
            const _t = new Date(TIME)
            const TimeString = `${_t.getFullYear()}/${_t.getMonth()+1}/${_t.getDate()} ${_t.toTimeString().split(' ')[0]}`
            return <tr key={`tableRow${i++}`}>
                <td className="p-1">{HULLNUM}</td>
                <td className="p-1">{TimeString}</td>
                {Object.keys(DATA).map(e => <td className="p-1" key={`TableColumn${j++}`}>{DATA[e] ? DATA[e] : ''}</td>)}
            </tr>
        });
    }

    return <table className="table table-striped table-bordered table-hover">
        <thead className="text-center">
        <tr>
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
                        setTime(({mm}) => ({hh: e < 10 ? '0' + e : String(e), mm: '00'}));
                    }}>{e}:00</small>
                </li>
            )) : [...Array(60).keys()].map(e => (
                <li key={`start_time_item_${e}`}>
                    <small className="dropdown-item" onClick={() => {
                        setFlag(!flag)
                        setTime(({hh}) => ({hh, mm: e < 10 ? '0' + e : String(e)}))
                    }}>{timeState.hh}:{e < 10 ? '0' + e : e}</small>
                </li>))}
        </ul>
    </div>
}

const DatePickerButton = forwardRef(({value, onClick}, ref) => (
    <button className="btn btn-secondary w-100" onClick={onClick} ref={ref}>
        {value}
    </button>
))
