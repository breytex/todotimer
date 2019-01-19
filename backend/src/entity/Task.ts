import { MaxLength } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { OwnerProjectEntity, User } from './User'

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
