import { IsEmail, MaxLength } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MyEntity } from './Entity'

@ObjectType()
@Entity()
export class User extends MyEntity {
    @Field()
    @Column()
    @IsEmail()
    email: string

    @ManyToMany(type => Project, project => project.userAccess, { lazy: true })
    projectAccess: Promise<Project[]>
}

@InputType()
export class UserInput {
    @Field()
    @MaxLength(30)
    email: string
}

export abstract class OwnerEntity extends MyEntity {

    @Field()
    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User
}

// Project has to be defined in same file like User
// to prevent circular includes
@ObjectType()
@Entity()
export class Project extends OwnerEntity {

    static async get(projectid: string, user: User): Promise<Project> {
        let project = await Project.findOne({ id: projectid, user })
        if (!project) {
            project = (await user.projectAccess).find(e => e.id === projectid)
            if (!project) {
                throw Error("projectNotFound")
            }
        }
        return project
    }

    @Field()
    @Column()
    title: string

    @Field()
    @Column()
    color?: string

    @ManyToMany(type => User, user => user.projectAccess, { lazy: true })
    @JoinTable()
    userAccess: Promise<User[]>

    @OneToMany(type => BoardColumn, boardColumn => boardColumn.project, { lazy: true })
    boardColumns: BoardColumn[]

    @Column()
    boardColumnsOrderJson: string = ""

    getBoardColumnsOrder() {
        return JSON.parse(this.boardColumnsOrderJson)
    }

    async getBoardByOrderIndex(index): Promise<BoardColumn> {
        const boardColumnOrder = this.getBoardColumnsOrder()
        if (index > boardColumnOrder.length) {
            throw Error("BoardOrderArrayOutOfBounce")
        }
        const boardColumns = (await this.boardColumns)
        return boardColumns.filter(column => column.id === boardColumnOrder[index])[0]
    }

}


@InputType()
export class ProjectInput {
    @Field()
    @MaxLength(30)
    title: string

    @Field()
    @MaxLength(7)
    color?: string
}

export abstract class OwnerProjectEntity extends OwnerEntity {
    @ManyToOne(type => Project, { lazy: true })
    @JoinColumn()
    project: Project
}


@Entity()
export class BoardColumn extends OwnerEntity {

    static createDefaultBoard = async (user) => {
        const boardColumns: BoardColumn[] = []

        boardColumns.push(await BoardColumn.create({ title: "Idea", color: "#ccc", emoji: "bulb", tasks: [], user }).save())
        boardColumns.push(await BoardColumn.create({ title: "Open", color: "#ccc", emoji: "fire", tasks: [], user }).save())
        boardColumns.push(await BoardColumn.create({ title: "Progress", color: "#ccc", emoji: "stopwatch", tasks: [], user }).save())
        boardColumns.push(await BoardColumn.create({ title: "Done", color: "#ccc", emoji: "white_check_mark", tasks: [], user }).save())

        const boardColumnIds: string[] = boardColumns.map(board => board.id)
        return { boardColumns, boardColumnIds: JSON.stringify(boardColumnIds) }

    }

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    color: string

    @Column()
    emoji: string

    @OneToMany(type => Task, task => task.boardColumn, { lazy: true })
    tasks: Task[]

    @ManyToOne(type => Project, { lazy: true })
    project: Project

}

@ObjectType()
@Entity()
export class Task extends OwnerProjectEntity {
    @Field()
    @Column()
    title: string

    @Field()
    @ManyToOne(type => User)
    @JoinColumn()
    asignee: User

    @ManyToOne(type => BoardColumn, boardColumn => boardColumn.tasks, { lazy: true })
    boardColumn: BoardColumn
}

@InputType()
export class TaskInput {
    @Field()
    @MaxLength(30)
    title: string
}


