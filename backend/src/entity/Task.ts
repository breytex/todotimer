import { Max, MaxLength, Min } from 'class-validator'
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

    @Field()
    @Column({ default: "" })
    text: string

    @Field()
    @Column({ default: 2 })
    priority: number

    @Field(type => User)
    @ManyToOne(type => User, { lazy: true })
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
export class TaskInputCreate {
    @Field()
    @MaxLength(100)
    title: string

    @Field({ nullable: true })
    text?: string

    @Field({ nullable: true })
    @Min(0)
    @Max(4)
    priority?: number
}

@InputType()
export class TaskInputEdit {
    @Field({ nullable: true })
    @MaxLength(100)
    title?: string

    @Field({ nullable: true })
    text?: string

    @Field({ nullable: true })
    @Min(0)
    @Max(4)
    priority?: number
}