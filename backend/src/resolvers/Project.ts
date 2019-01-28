import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql"
import { getConnection } from "typeorm"
import { log } from "util"
import { Project, User } from "../entity/User"
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
        if (project && (await project.userAccess).filter(e => e.id === user.id).length > 0) {
            return project
        } else {
            throw Error("notFound")
        }
    }

    @Authorized()
    @Mutation(returns => Project)
    async createProject(@Arg("title") title: string, @Arg("color", { nullable: true }) color: string, @Ctx() { user }: MyContext) {
        const project = await Project.create({ title, color, user })
        await project.save()
        await project.reload()
        return project
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
