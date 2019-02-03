import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql"
import { Task } from '../entity/User'
import { Project, User } from "../entity/User"
import { checkAccess } from "../helpers/access"
import { MyContext } from './../types'

export class TaskResolver {

  @Authorized()
  @Query(returns => [Task])
  async tasks(@Arg("projectid", { nullable: true }) projectid: string, @Ctx() { user, session }: MyContext) {
    if (projectid) {
      // project specified in query
      const project = await Project.get(projectid, user)
      if (await checkAccess(project, user)) {
        return await Task.find({ project, asignee: user })
      }
    } else {
      // task overview screen
      return await Task.find({ user })
    }

  }

  @Authorized()
  @Query(returns => Task)
  async task(@Arg("id") id: string, @Ctx() { user }: MyContext) {
    const task = await Task.findOneOrFail({ id }, { relations: ["asignee"] }) // restricting access to tasks's which belong to the loggedIn user
    if (await checkAccess(task, user)) {
      return task
    }
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async createTask(@Arg("projectid") projectid: string, @Arg("title") title: string, @Ctx() { user }: MyContext) {
    const project = await Project.get(projectid, user) // check if project exists
    if (await checkAccess(project, user)) {
      let task
      if ((await project.userAccess).length === 0) {
        // assign all tasks to the user itself, if no other users are invited to the project
        task = await Task.create({ title, user, project, asignee: user })
      } else {
        task = await Task.create({ title, user, project })
      }

      await task.save()

      // add task to first board column
      const firstBoardColumn = project.getBoardByOrderIndex(0)
      firstBoardColumn.tasks.push(task)
      firstBoardColumn.save()
      return true
    }

  }
}
