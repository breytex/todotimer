import { BoardColumn } from "../entity/BoardColumn"
import { Project } from "../entity/Project"
import { Task } from "../entity/Task"
import { User } from "../entity/User"

export const checkAccess = async (entity: Project | Task | BoardColumn, user: User, ownerAccessOnly = false) => {
    // trivial case: user is owner of the given entity
    if (entity.user.id === user.id) {
        return true
    }
    if (ownerAccessOnly) {
        // if ownerAccesOnly is enabled and we reach this line, the access is denied
        // because owner access was tested already above
        return false
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