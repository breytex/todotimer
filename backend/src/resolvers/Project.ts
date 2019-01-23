import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql"
import { log } from "util"
import { Project, User } from "../entity/User"
import { MyContext } from './../types'

export class ProjectResolver {

    @Authorized()
    @Query(returns => [Project])
    async projects(@Ctx() { user }: MyContext) {
        const ownProjects = await Project.find({ user })
        const remoteProjects = user.projectAccess
        return [...ownProjects, ...remoteProjects]
    }

    @Authorized()
    @Query(returns => Project)
    async project(@Arg("id") id: string, @Ctx() { user }: MyContext) {
        const project = await Project.findOne({ id }, { relations: ["userAccess"] })
        if (project && project.userAccess.filter(e => e.id === user.id).length > 0) {
            return project
        } else {
            throw Error("notFound")
        }
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async createProject(@Arg("title") title: string, @Arg("color", { nullable: true }) color: string, @Ctx() { user }: MyContext) {
        const project = await Project.create({ title, color, user })
        await project.save()
        return true
    }

    @Authorized()
    @Mutation(returns => Boolean)
    async grantProjectAccessByEmail(@Arg("projectid") id: string, @Arg("email") email: string, @Ctx() { user }: MyContext) {
        try {
            const project = await Project.findOneOrFail({ id, user }, { relations: ["userAccess"] })
            const invitee = await User.findOneOrFail({ email })
            project.userAccess.push(invitee)
            await project.save()
            return true
        } catch (e) {
            log(e)
            return false
        }
    }
}
