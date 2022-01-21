import {generateAccessToken, generateRefreshToken} from "../../../lib/token";

const mockUp = [
    {
        id: "test",
        password: "test",
        info: "secret"
    }
]

export const resolvers = {
    Query: {
        getUser: async (_, {userId, password}) => {
            const result = mockUp.find(e => e.id === userId && e.password === password)
            if (!result) {
                return ["invalid user info"]
            }
            return [generateAccessToken(userId), generateRefreshToken(userId)]
        }
    }
}