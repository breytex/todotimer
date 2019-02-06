import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql"
import { getConnection } from "typeorm"
import { BoardColumn, Task } from '../entity/User'
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
    try {
      const project = await Project.findOneOrFail(projectid) // check if project exists
      console.log(project)
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
        const firstBoardColumn = await project.getBoardByOrderIndex(0)
        await getConnection()
          .createQueryBuilder()
          .relation(BoardColumn, 'tasks')
          .of(firstBoardColumn)
          .addAndRemove(task, task)

      }
    } catch (e) {
      console.error(e)
      throw Error(e)
    }
    return true
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async moveTask(@Arg("taskid") taskid: string, @Arg("targetboardcolumnid") columnid: string, @Ctx() { user }: MyContext) {
    const task = await Task.findOneOrFail({ where: { id: taskid } })
    await checkAccess(task, user)
    const boardColumn = await BoardColumn.findOneOrFail({ where: { id: columnid } })
    await checkAccess(boardColumn, user)

    await getConnection()
      .createQueryBuilder()
      .relation(Task, 'boardColumn')
      .of(task).
      set(boardColumn)



    return true
  }

  @Authorized()
  @Mutation(returns => Boolean)
  async deleteTask(@Arg("taskid") taskid: string, @Ctx() { user }: MyContext) {
    const task = await Task.findOneOrFail({ where: { id: taskid } })
    await checkAccess(task, user)
    await task.remove()
    return true
  }

}
