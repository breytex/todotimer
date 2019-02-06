import { BoardColumn, Task } from "../entity/User"
import { Project, User } from "../entity/User"

export const checkAccess = async (entity: Project | Task | BoardColumn, user: User) => {
    // trivial case: user is owner of the given entity
    if (entity.user.id === user.id) {
        return true
    }

    // cascading to the root project of the entity
    // and checking user access array for "user"
    let project: Project
    switch (entity.constructor.name) {
        case Task.name:
            project = await (entity as Task).project
            break
        case Project.name:
            project = entity as Project
            break
        case BoardColumn.name:
            project = await (entity as BoardColumn).project
            break
        default:
            throw new Error("serverError")
            break
    }

    const userAccess = await project.userAccess
    if (userAccess.some(e => e.id === user.id)) {
        return true
    } else {
        throw new Error("accessDenied")
    }
}