import { Connection } from "typeorm"
import { loginUser } from '../test-utils/loginHelper'

import * as faker from "faker"
import { watchFile } from "fs"
import { GraphQLError } from "graphql"
import { BoardColumn } from "../entity/BoardColumn"
import { Project } from "../entity/Project"
import { Task } from "../entity/Task"
import { gCall } from "../test-utils/gCall"
import { createTypeormConn } from "../typeormConnection"
let conn: Connection

const userA = { sessionToken: "", projectTitle: "Project from user A", projectShort: "A", taskTitle: "Task in Project form user A created by user A", email: faker.internet.email() }
const userB = { sessionToken: "", projectTitle: "Project from user B", projectShort: "B", email: faker.internet.email() }
beforeAll(async () => {
    conn = await createTypeormConn({ testing: true })
    userA.sessionToken = await loginUser(userA.email)
    userB.sessionToken = await loginUser(userB.email)
})
afterAll(async () => {
    await conn.close()
})


const createProjectMutation = `
mutation CreateProject($projectData: ProjectInputCreate!){createProject(projectData:$projectData){title}}
`

const editProjectMutation = `
mutation EditProject($projectid: String!, $projectData: ProjectInputEdit!){editProject(projectid:$projectid, projectData:$projectData)}
`

const toggleArchiveProjectMutation = `
mutation ToggleArchiveProject($projectid: String!){toggleArchiveProject(projectid:$projectid)}
`

const deleteProjectMutation = `
mutation DeleteProject($projectid: String!){deleteProject(projectid:$projectid)}
`

const grantProjectAccessMutation = `
mutation GrantAccess($email: String!, $projectid: String!){
    grantProjectAccessByEmail(projectid: $projectid, email: $email)
}`

const projectsQuery = `query{projects{title}}`
const projectQuery = `query Project($id: String!){project(id:$id){title}}`
const projectQueryBig = `query Project($id: String!){
    project(id:$id){
        title
        boardColumnsOrderJson
        boardColumnsOrder
        boardColumns{
            title
            tasks{
                title
                asignee{
                    email
                }
            }
        }
    }
}`

const createTask = `mutation CreateTask($projectid: String!, $taskData: TaskInputCreate!){
    createTask(projectid: $projectid, taskData: $taskData)
}`

const editTask = `mutation EditTask($taskid: String!, $taskData: TaskInputEdit!){
    editTask(taskid: $taskid, taskData: $taskData)
}`

const moveTask = `mutation MoveTask($taskid: String!, $targetboardcolumnid: String!){
    moveTask(taskid: $taskid, targetboardcolumnid: $targetboardcolumnid)
}`

const deleteTask = `mutation DeleteTask($taskid: String!){
    deleteTask(taskid: $taskid)
}`

describe("A loggedin user", async () => {

    let projectA: Project
    describe("should be able to", () => {
        it("create a project and edit it", async () => {
            await gCall({
                source: createProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectData: { title: "abc", color: "#ff0000", short: userA.projectShort } }
            })

            projectA = await Project.findOne({ where: { title: "abc" } })

            expect(projectA.color).toBe("#ff0000")

            const response = await gCall({
                source: editProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectid: projectA.id, projectData: { title: userA.projectTitle, color: "#000000" } }
            })

            await projectA.reload()

            expect(response).toMatchObject({ "data": { "editProject": true } })
            expect(projectA.color).toBe("#000000")
            expect(projectA.title).toBe(userA.projectTitle)
        })

        it("create a project and remove it", async () => {
            const projectTitle = "abcdefg"
            const response = await gCall({
                source: createProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectData: { title: projectTitle, color: "#ff0000", short: "abc" } }
            })

            const projectNew = await Project.findOne({ where: { title: projectTitle } })

            expect(response).toMatchObject({ "data": { "createProject": { "title": projectTitle } } })
            expect(projectNew.color).toBe("#ff0000")

            const responseDelete = await gCall({
                source: deleteProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectid: projectNew.id }
            })

            expect(responseDelete).toMatchObject({ "data": { "deleteProject": true } })

            const projectNewFindAgain = await Project.findOne({ where: { title: projectTitle } })

            expect(projectNewFindAgain).toBeUndefined()

        })

        it("not create a project with a wrong short-field", async () => {
            const response = await gCall({
                source: createProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectData: { title: userA.projectTitle, color: "#000000", short: "123456" } }
            })
            expect(response).toMatchObject({ "data": null, "errors": [new GraphQLError("Argument Validation Error")] })
        })
    })

    let task: Task
    let firstBoardColumn: BoardColumn
    let nextBoardColumn: BoardColumn
    describe("should be able to", () => {
        it("create a task in a project and edit it", async () => {
            const tempTitle = "temp task title"
            const response = await gCall({
                source: createTask, cookie: userA.sessionToken,
                variableValues: { taskData: { title: tempTitle }, projectid: projectA.id }
            })

            task = await Task.findOne({ where: { title: tempTitle } })

            expect(response).toMatchObject({
                "data": {
                    "createTask": true,
                }
            })
            expect(task.title).toBe(tempTitle)

            firstBoardColumn = await task.boardColumn

            nextBoardColumn = await (await firstBoardColumn.project).getBoardByOrderIndex(1)

            expect(firstBoardColumn.title).toBe("Idea")

            const responseEdit = await gCall({
                source: editTask, cookie: userA.sessionToken,
                variableValues: { taskData: { title: userA.taskTitle }, taskid: task.id }
            })

            expect(responseEdit).toMatchObject({
                "data": {
                    "editTask": true,
                }
            })

            await task.reload()

            expect(task.title).toBe(userA.taskTitle)

        })

        it("archive and un-archive a project", async () => {
            const response = await gCall({
                source: toggleArchiveProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectid: projectA.id }
            })
            await projectA.reload()
            expect(response).toMatchObject({ "data": { "toggleArchiveProject": true } })
            expect(projectA.archived).toBe(true)

            await gCall({
                source: toggleArchiveProjectMutation, cookie: userA.sessionToken,
                variableValues: { projectid: projectA.id }
            })

            await projectA.reload()
            expect(projectA.archived).toBe(false)
        })
    })

    describe("should be able to", () => {
        it("move a task to another board column", async () => {
            const response = await gCall({
                source: moveTask, cookie: userA.sessionToken,
                variableValues: { taskid: task.id, targetboardcolumnid: nextBoardColumn.id }
            })

            expect(response).toMatchObject({
                "data": {
                    "moveTask": true,
                }
            })

            const taskFetchedAgain = await Task.findOne({ where: { title: userA.taskTitle } })

            const boardColumn = await taskFetchedAgain.boardColumn

            expect(boardColumn.id).toBe(nextBoardColumn.id)

        })
    })

    describe("should not be able to", () => {
        it("move a task of another user to another board column", async () => {
            const response = await gCall({
                source: moveTask, cookie: userB.sessionToken,
                variableValues: { taskid: task.id, targetboardcolumnid: nextBoardColumn.id }
            })
            expect(response.errors[0].message).toBe("accessDenied")
        })
    })

    describe("should be able to", () => {
        it("share a project with another user", async () => {
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

        it("can move a task of another user to another board column", async () => {
            const response = await gCall({
                source: moveTask, cookie: userB.sessionToken,
                variableValues: { taskid: task.id, targetboardcolumnid: firstBoardColumn.id }
            })

            expect(response).toMatchObject({
                "data": {
                    "moveTask": true,
                }
            })

            const taskFetchedAgain = await Task.findOne({ where: { title: userA.taskTitle } })

            const boardColumn = await taskFetchedAgain.boardColumn

            expect(boardColumn.id).toBe(firstBoardColumn.id)

        })

        it("query a list of all boardColumns and all tickets of a project", async () => {
            const response = await gCall({
                source: projectQueryBig, cookie: userB.sessionToken, variableValues: { id: projectA.id }
            })
            const ideaBoard = response.data.project.boardColumns.filter(e => e.title === "Idea")[0]
            expect(ideaBoard.tasks[0].title).toBe(userA.taskTitle)

        })
    })

    describe("The owner of a task", () => {
        it("who owns a task", async () => {
            const response = await gCall({
                source: deleteTask, cookie: userA.sessionToken,
                variableValues: { taskid: task.id }
            })

            expect(response).toMatchObject({
                "data": {
                    "deleteTask": true,
                }
            })

            const taskFetchedAgain = await Task.findOne({ where: { title: userA.taskTitle } })

            expect(taskFetchedAgain).toBe(undefined)
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
