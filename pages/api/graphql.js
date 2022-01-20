import { ApolloServer } from "apollo-server-micro";
import {gql} from "@apollo/client";
// import { typeDefs } from "./schemas";
// import { resolvers } from "./resolvers";

const typeDefs = gql`
    type Query {
        sayHello: String
    }
`;

const resolvers = {
    Query: {
        sayHello(parent, args, context) {
            return 'Hello World!';
        },
    },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export const config = {
    api: {
        bodyParser: false
    }
};

export default apolloServer.start().then(() => {
    return apolloServer.createHandler({ path: "/api/graphql" })
})