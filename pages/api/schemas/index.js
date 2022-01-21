import { gql } from "apollo-server-micro"

export const typeDefs = gql`
    type User {
        id: String!
        password: String!
        info: String
    }
    
    type Query {
        login(userId: String!, password: String!): [String]
        refresh(rToken: String!): String
    }
`