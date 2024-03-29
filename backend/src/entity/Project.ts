import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { MaxLength, MinLength } from 'class-validator'
import { BoardColumn } from './BoardColumn'
import { MyEntity } from './Entity'
import { User } from './User'

@ObjectType()
@Entity()
export class Project extends MyEntity {

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

    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Field()
    @Column()
    title: string

    @Field()
    @Column({ length: 5 })
    short: string

    @Field()
    @Column({ default: false })
    archived: boolean

    @Field()
    @Column()
    color?: string

    @ManyToMany(type => User, user => user.projectAccess, { lazy: true })
    @JoinTable()
    userAccess: Promise<User[]>

    @Field(type => [BoardColumn])
    @OneToMany(type => BoardColumn, boardColumn => boardColumn.project, { lazy: true })
    boardColumns: BoardColumn[]

    @Field()
    @Column()
    boardColumnsOrderJson: string = ""

    @Field(type => User)
    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User

    @Field(type => [String])
    boardColumnsOrder() {
        return JSON.parse(this.boardColumnsOrderJson)
    }

    async getBoardByOrderIndex(index): Promise<BoardColumn> {
        const boardColumnOrder = this.boardColumnsOrder()
        if (index > boardColumnOrder.length) {
            throw Error("BoardOrderArrayOutOfBounce")
        }
        const boardColumns = (await this.boardColumns)
        return boardColumns.filter(column => column.id === boardColumnOrder[index])[0]
    }

}

@InputType()
export class ProjectInputCreate {
    @Field()
    @MaxLength(30)
    title: string

    @Field()
    @MaxLength(7)
    color: string

    @Field()
    @MaxLength(5)
    @MinLength(1)
    short: string
}

@InputType()
export class ProjectInputEdit {
    @Field({ nullable: true })
    @MaxLength(30)
    title?: string

    @Field({ nullable: true })
    @MaxLength(7)
    color?: string
}


