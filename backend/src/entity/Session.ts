import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Generated } from 'typeorm'
import { Column } from 'typeorm'
import { MyEntity } from "./Entity"
import { User } from './User'

abstract class TokenData extends MyEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string



    @ManyToOne(type => User, { eager: true })
    @JoinColumn()
    user: User
}

@Entity()
export class Session extends TokenData {
    @Column()
    @Generated("uuid")
    token: string
}

@Entity()
export class Login extends TokenData {
    @Column()
    token: string
}