import { Field, ID, ObjectType } from "type-graphql"
import { Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Column, ManyToOne, OneToMany } from 'typeorm'
import { MyEntity } from "./Entity"
import { Project } from "./Project"
import { Task } from './Task'
import { User } from "./User"

@ObjectType()
@Entity()
export class BoardColumn extends MyEntity {

    static createDefaultBoard = async (user) => {
        const boardColumns: BoardColumn[] = []

        boardColumns.push(await BoardColumn.create({ title: "Idea", color: "#ccc", emoji: "bulb", tasks: [], user }).save())
        boardColumns.push(await BoardColumn.create({ title: "Open", color: "#ccc", emoji: "fire", tasks: [], user }).save())
        boardColumns.push(await BoardColumn.create({ title: "Progress", color: "#ccc", emoji: "stopwatch", tasks: [], user }).save())
        boardColumns.push(await BoardColumn.create({ title: "Done", color: "#ccc", emoji: "white_check_mark", tasks: [], user }).save())

        const boardColumnIds: string[] = boardColumns.map(board => board.id)
        return { boardColumns, boardColumnIds: JSON.stringify(boardColumnIds) }

    }

    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Field()
    @Column()
    title: string

    @Field()
    @Column()
    color: string

    @Field()
    @Column()
    emoji: string

    @Field(type => [Task])
    @OneToMany(type => Task, task => task.boardColumn, { lazy: true })
    tasks: Task[]

    @ManyToOne(type => Project, { lazy: true })
    project: Project

    @Field(type => User)
    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User

}