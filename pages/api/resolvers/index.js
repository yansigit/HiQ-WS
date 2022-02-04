import DBConnector from "../../../lib/db";

export const resolvers = {
    Query: {
        async getGraphs(parent, args, context, info) {
            const {hullNum, startTime, endTime, preset} = args
            const whereDict = {
                Deballasting: '(NVL(P_132_FD, 0) + NVL(P_232_FD, 0) + NVL(P_332_FD, 0) > 0)',
                Ballasting: '(NVL(REC1000, 0) + NVL(REC2000, 0) + NVL(REC3000, 0) + NVL(REC4000, 0)) > 0'
            }
            return DBConnector.getInstance.table("SHIPDATA_MASTER_FORM")
                .where('HULLNUM', hullNum)
                .whereBetween('TIME', [startTime, endTime])
                .whereRaw(whereDict[preset])
                .select()
        }
    }
}