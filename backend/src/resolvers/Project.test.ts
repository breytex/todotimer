import { Connection } from "typeorm"
import { loginUser } from '../test-utils/loginHelper'

import * as faker from "faker"
import { Project } from "../entity/User"
import { gCall } from "../test-utils/gCall"
import { createTypeormConn } from "../typeormConnection"
let conn: Connection

const userA = { sessionToken: "", projectTitle: "Project from user A", email: faker.internet.email() }
const userB = { sessionToken: "", projectTitle: "Project from user B", email: faker.internet.email() }
beforeAll(async () => {
    conn = await createTypeormConn({ testing: true })
    userA.sessionToken = await loginUser(userA.email)
    userB.sessionToken = await loginUser(userB.email)
})
afterAll(async () => {
    await conn.close()
})


const createProjectMutation = `
mutation CreateProject($title: String!, $color: String!){createProject(title:$title, color:$color){title}}
`

const grantProjectAccessMutation = `
mutation GrantAccess($email: String!, $projectid: String!){
    grantProjectAccessByEmail(projectid: $projectid, email: $email)
}`

const projectsQuery = `query{projects{title}}`
const projectQuery = `query Project($id: String!){project(id:$id){title}}`

describe("A loggedin user", async () => {

    let projectA: Project
    describe("should be able to", () => {
        it("create a project", async () => {
            await gCall({
                source: createProjectMutation, cookie: userA.sessionToken,
                variableValues: { title: userA.projectTitle, color: "#000000" }
            })

            projectA = await Project.findOne({ where: { title: userA.projectTitle } })

            expect(projectA.title).toBe(userA.projectTitle)

        })
    })

    describe("and", () => {
        it("share it with another user", async () => {
            const response = await gCall({
                source: grantProjectAccessMutation, cookie: userA.sessionToken,
                variableValues: { email: userB.email, projectid: projectA.id }
            })
            expect(response).toMatchObject({ data: { grantProjectAccessByEmail: true } })
        })
    })

    describe("who then", () => {
        it("has access to that shared project in the list", async () => {
            const response = await gCall({
                source: projectsQuery, cookie: userB.sessionToken
            })
            expect(response).toMatchObject({
                data: {
                    projects: [{ title: userA.projectTitle }]
                }
            })
        })

        it("can access the shared project directly", async () => {
            const response = await gCall({
                source: projectQuery, cookie: userB.sessionToken, variableValues: { id: projectA.id }
            })
            expect(response).toMatchObject({
                data: {
                    project: { title: userA.projectTitle }
                }
            })
        })
    })

})

// describe("A user", () => {
//     it("should not have access to a different users project", async () => {
//         const projectFromB = await gCall({
//             source: createProjectMutation, cookie: userB.sessionToken,
//             variableValues: { title: userB.projectTitle, color: "#000000" }
//         })

//     })
// })
