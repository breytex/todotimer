import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql"
import { getConnection } from "typeorm"
import { log } from "util"
import { BoardColumn } from "../entity/BoardColumn"
import { Project, ProjectInputCreate, ProjectInputEdit } from "../entity/Project"
import { User } from "../entity/User"
import { checkAccess } from '../helpers/access'
import { MyContext } from './../types'

export class ProjectResolver {

    @Authorized()
    @Query(returns => [Project])
    async projects(@Ctx() { user }: MyContext) {
        const ownProjects = await Project.find({ user })
        const remoteProjects = await user.projectAccess
        return [...ownProjects, ...remoteProjects]
    }

    @Authorized()
    @Query(returns => Project)
    async project(@Arg("id") id: string, @Ctx() { user }: MyContext) {
        const project = await Project.findOne({ id })

        if (project) {
            checkAccess(project, user)
            return project
        } else {
            throw Error("notFound")
        }
    }

    @Authorized()
    @Mutation(returns => Project)
    async createProject(@Arg("projectData") projectData: ProjectInputCreate, @Ctx() { user }: MyContext) {
        let project: Project
        try {
            const initialBoard = await BoardColumn.createDefaultBoard(user)
            project = await Project.create({ ...projectData, user })
            project.boardColumns = initialBoard.boardColumns
            project.boardColumnsOrderJson = initialBoard.boardColumnIds
            await project.save()
            await project.reload()
        } catch (e) {
            console.error(e)
            throw new Error(e)
        }

        return project
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async editProject(@Arg("projectid") id: string, @Arg("projectData") projectData: ProjectInputEdit, @Ctx() { user }: MyContext) {
        const project: Project = await Project.findOneOrFail({ id })
        checkAccess(project, user)
        for (const key in projectData) {
            if (projectData.hasOwnProperty(key)) {
                project[key] = projectData[key]
            }
        }
        await project.save()
        return true
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async toggleArchiveProject(@Arg("projectid") id: string, @Ctx() { user }: MyContext) {
        const project: Project = await Project.findOneOrFail({ id })
        checkAccess(project, user)
        project.archived = !project.archived
        await project.save()
        return true
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async grantProjectAccessByEmail(@Arg("projectid") id: string, @Arg("email") email: string, @Ctx() { user }: MyContext) {
        try {
            const project = await Project.findOneOrFail({ id, user })
            const invitee = await User.findOneOrFail({ email })
            const projectAccess = await project.userAccess
            // TODO: fix project.test error
            project.userAccess = Promise.resolve([invitee])

            await getConnection()
                .createQueryBuilder()
                .relation(Project, 'userAccess')
                .of(project)
                .addAndRemove(invitee, invitee)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
}
