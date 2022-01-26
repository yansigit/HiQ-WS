import { gql } from "apollo-server-micro"

export const typeDefs = gql`
    type Graph {
        HULLNUM: Int!,
        TIME: String!,
        AIT_1121: Int,
        AIT_1122: Int,
        AIT_1123: Int,
        AIT_151: Int,
        AIT_251: Int,
        AIT_351: Int,
        AP_LVL_01: Int,
        CT_1111: Int,
        CT_1751: Int,
        FCV_1131_CMD: Int,
        FCV_1131_FD: Int,
        FCV_1211_CMD: Int,
        FCV_1211_FD: Int,
        FCV_1751_CMD: Int,
        FCV_1751_FD: Int,
        FCV_3131_CMD: Int,
        FCV_3131_FD: Int,
        FCV_3211_CMD: Int,
        FCV_3211_FD: Int,
        FIT_1131: Int,
        FIT_1211: Int,
        FIT_2131: Int,
        FIT_2211: Int,
        FIT_3131: Int,
        FIT_3211: Int,
        GPS_LAT: Int,
        GPS_LON: Int,
        LIT_1311: Int,
        PIT_1211: Int,
        PIT_1212: Int,
        PIT_2211: Int,
        PIT_2212: Int,
        PIT_3211: Int,
        PIT_3212: Int,
        PT_1121: Int,
        PT_1721: Int,
        PT_1722: Int,
        P_132_CMD: Int,
        P_132_FD: Int,
        P_232_CMD: Int,
        P_232_FD: Int,
        P_332_CMD: Int,
        P_332_FD: Int,
        REC1017: Int,
        REC1018: Int,
        REC1019: Int,
        REC1020: Int,
        REC1021: Int,
        REC1027: Int,
        REC1028: Int,
        REC1029: Int,
        REC1030: Int,
        REC1031: Int,
        REC1043: Int,
        REC2017: Int,
        REC2018: Int,
        REC2019: Int,
        REC2020: Int,
        REC2021: Int,
        REC2027: Int,
        REC2028: Int,
        REC2029: Int,
        REC2030: Int,
        REC2031: Int,
        REC2043: Int,
        REC3017: Int,
        REC3018: Int,
        REC3019: Int,
        REC3020: Int,
        REC3021: Int,
        REC3027: Int,
        REC3028: Int,
        REC3029: Int,
        REC3030: Int,
        REC3031: Int,
        REC3043: Int,
        REC4017: Int,
        REC4018: Int,
        REC4019: Int,
        REC4020: Int,
        REC4021: Int,
        REC4027: Int,
        REC4028: Int,
        REC4029: Int,
        REC4030: Int,
        REC4031: Int,
        REC4043: Int,
        TE_1111: Int,
        REC1000: Int,
        REC2000: Int,
        REC3000: Int,
        REC4000: Int,
    }

    type Query {
        getGraphs(hullNum: Int!, startTime: String!, endTime: String!): [Graph]
    }
`