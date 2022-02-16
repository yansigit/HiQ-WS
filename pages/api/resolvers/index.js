import DBConnector from "../../../lib/db";
import {GraphQLScalarType} from "graphql";
import { Kind } from 'graphql/language';

export const resolvers = {
    Date: new GraphQLScalarType({
            name: 'Date',
            description: 'Date custom scalar type',
            parseValue(value) {
                return new Date(value); // value from the client
            },
            serialize(value) {
                return value.getTime(); // value sent to the client
            },
            parseLiteral(ast) {
                if (ast.kind === Kind.INT) {
                    return parseInt(ast.value, 10); // ast value is always in string format
                }
                return null;
            }
        }),
    Query: {
        async getGraphs(parent, args, context, info) {
            const {hullNum, startTime, endTime, preset} = args
            const whereDict = {
                Custom: '',
                Deballasting: 'NVL(P_132_FD, 0) + NVL(P_232_FD, 0) + NVL(P_332_FD, 0) > 0',
                Ballasting: 'NVL(REC1000, 0) + NVL(REC2000, 0) + NVL(REC3000, 0) + NVL(REC4000, 0) > 0'
            }

            const query = DBConnector.getInstance.table("SHIPDATA_MASTER_FORM")
                .where('HULLNUM', hullNum)
                .whereRaw(whereDict[preset])
                .whereRaw('TIME between TO_DATE(?, \'YYYY-MM-DD HH24:mi:ss\') and TO_DATE(?, \'YYYY-MM-DD HH24:mi:ss\')', [startTime, endTime])
                .select()
            const result = await query
            // console.log(query.toQuery())
            // console.log(result ? result[0] : '값 없음')
            return query;
        }
    }
}
