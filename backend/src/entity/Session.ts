import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Generated } from 'typeorm'
import { Column } from 'typeorm'
import { MyEntity } from "./Entity"
import { User } from './User'

abstract class TokenData extends MyEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    @Generated("uuid")
    token: string

    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User
}

@Entity()
export class Session extends TokenData { }

@Entity()
export class Login extends TokenData { }