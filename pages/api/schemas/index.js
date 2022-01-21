import { gql } from "apollo-server-micro"

export const typeDefs = gql`
    type User {
        id: String!
        password: String!
        info: String
    }
    
    type Query {
        getUser(userId: String!, password: String!): [String]
    }
`