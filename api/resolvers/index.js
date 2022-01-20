export const resolvers = {
    Query: {
        getUsers: async () => {
            const { body } = await fetch({
                url: "https://api.github.com/users",
                method: "GET"
            })
            console.log(body)
        },
        getUser: async (_, args) => {
            const { body } = await fetch({
                url: `https://api.github.com/users/${args.name}`,
                method: "GET"
            })
            console.log(body)
        }
    }
}