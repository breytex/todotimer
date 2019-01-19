import { IsEmail, MaxLength } from 'class-validator'
import { Field, ID, InputType, ObjectType } from 'type-graphql'
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm"
import { MyEntity } from './Entity'

@ObjectType()
@Entity()
export class User extends MyEntity {
    @Field()
    @Column()
    @IsEmail()
    email: string

    @ManyToMany(type => Project, project => project.userAccess)
    projectAccess: Project[]
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
            project = user.projectAccess.find(e => e.id === projectid)
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

    @ManyToMany(type => User, user => user.projectAccess)
    @JoinTable()
    userAccess: User[]
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