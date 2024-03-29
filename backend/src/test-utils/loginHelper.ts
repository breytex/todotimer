import * as faker from "faker"
import { User } from "../entity/User"
import { Login, Session } from './../entity/Session'
import { gCall } from './gCall'


const registerMutation = `
mutation Register($email: String!) {
    requestSignIn(user:{email:$email})
}
`
const loginMutation = `
mutation Login($token: String!) {
    signIn(token:$token){
        email
    }
}
`

export const loginUser = async (email = faker.internet.email()) => {
    const responseRequestSignIn = await gCall({
        source: registerMutation,
        variableValues: {
            email,
        }
    })

    expect(responseRequestSignIn).toMatchObject({ "data": { "requestSignIn": true } })

    const dbUser = await User.findOne({ where: { email } })
    expect(dbUser).toBeDefined()

    const { token } = await Login.findOne({ where: { user: dbUser } })

    const loginResponse = await gCall({
        source: loginMutation,
        variableValues: {
            token,
        }
    })
    expect(loginResponse.data.signIn.email).toBe(email)

    const user = await User.findOneOrFail({ email })
    const session = await Session.findOneOrFail({ user })

    return session.token
}