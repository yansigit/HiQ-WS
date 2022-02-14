import {atom, selector} from "recoil";

const chartLabelState = atom({
    key: 'chartLabelState',
    default: []
})

const chartHtmlLegends = selector({
    key: 'chartHtmlLegends',
    get: ({get}) => {
        const labels = get(chartLabelState)
        return labels.map(e => <span>{e.text}</span>)
    }
})

export {chartHtmlLegends, chartLabelState}
