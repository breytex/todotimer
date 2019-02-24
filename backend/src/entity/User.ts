import { IsEmail, MaxLength } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { MyEntity } from './Entity'
import { Project } from './Project'

@ObjectType()
@Entity()
export class User extends MyEntity {
    @Field(type => ID)
    @PrimaryGeneratedColumn("uuid")
    id: string

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
    @IsEmail()
    email: string
}





