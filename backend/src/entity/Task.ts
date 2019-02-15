import { MaxLength } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { JoinColumn } from 'typeorm'
import { BoardColumn } from './BoardColumn'
import { MyEntity } from './Entity'
import { Project } from './Project'
import { User } from './User'

@ObjectType()
@Entity()
export class Task extends MyEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Field()
    @Column()
    title: string

    @Field(type => User)
    @ManyToOne(type => User)
    @JoinColumn()
    asignee: User

    @ManyToOne(type => BoardColumn, boardColumn => boardColumn.tasks, { lazy: true })
    boardColumn: BoardColumn

    @ManyToOne(type => Project, { lazy: true })
    @JoinColumn()
    project: Project

    @Field(type => User)
    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User
}

@InputType()
export class TaskInput {
    @Field()
    @MaxLength(30)
    title: string
}
