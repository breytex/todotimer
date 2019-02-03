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
    @ManyToOne(type => User)
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

    @OneToMany(type => BoardColumn, boardColumn => boardColumn.project, { eager: true })
    boardColumns: BoardColumn[]

    @Column()
    boardColumnsOrder: string


    getBoardByOrderIndex(index): BoardColumn {
        if (index > this.boardColumnsOrder.length) {
            throw Error("BoardOrderArrayOutOfBounce")
        }
        return this.boardColumns.filter(column => column.id === this.boardColumnsOrder[index])[0]
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
    @ManyToOne(type => Project)
    @JoinColumn()
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
}

@InputType()
export class TaskInput {
    @Field()
    @MaxLength(30)
    title: string
}


@Entity()
export class BoardColumn extends BaseEntity {

    static createDefaultBoard = async () => {
        const boardColumns: BoardColumn[] = []

        boardColumns.push(await BoardColumn.create({ title: "Idea", color: "#ccc", emoji: "bulb", tasks: [] }).save())
        boardColumns.push(await BoardColumn.create({ title: "Open", color: "#ccc", emoji: "fire", tasks: [] }).save())
        boardColumns.push(await BoardColumn.create({ title: "Progress", color: "#ccc", emoji: "stopwatch", tasks: [] }).save())
        boardColumns.push(await BoardColumn.create({ title: "Done", color: "#ccc", emoji: "white_check_mark", tasks: [] }).save())

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

    @OneToOne(type => Task, { eager: true })
    tasks: Task[]

    @ManyToOne(type => Project)
    @JoinColumn()
    project: Project

}