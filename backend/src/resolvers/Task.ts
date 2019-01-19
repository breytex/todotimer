import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql"
import { Task } from '../entity/Task'
import { Project, User } from "../entity/User"
import { MyContext } from './../types'

export class TaskResolver {

  @Authorized()
  @Query(returns => [Task])
  async tasks(@Arg("projectid", { nullable: true }) projectid: string, @Ctx() { user, session }: MyContext) {
    if (projectid) {
      // project specified in query
      const project = await Project.get(projectid, user)
      return await Task.find({ project, asignee: user })
    } else {
      // task overview screen
      return await Task.find({})
    }

  }

  @Authorized()
  @Query(returns => Task)
  async task(@Arg("id") id: string, @Ctx() { user }: MyContext) {
    const task = await Task.findOne({ id }, { relations: ["project"] }) // restricting access to tasks's which belong to the loggedIn user

    if (!task) {
      throw Error("notFound")
    }

    if (task.user.id === user.id) {
      // user is owner of task
      return task
    } else {
      const userHasAccessToProject = task.project.userAccess.some(e => e.id === user.id)
      if (userHasAccessToProject) {
        return task
      } else {
        throw Error("accessDenied")
      }
    }
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async createTask(@Arg("projectid") projectid: string, @Arg("title") title: string, @Ctx() { user }: MyContext) {
    const project = await Project.get(projectid, user) // check if project exists

    let task
    if (project.userAccess.length === 0) {
      // assign all tasks to the user itself, if no other users are invited to the project
      task = await Task.create({ title, user, project, asignee: user })
    } else {
      task = await Task.create({ title, user, project })
    }

    await task.save()
    return true
  }
}
