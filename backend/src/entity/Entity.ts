import { CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { BaseEntity } from 'typeorm'
export abstract class MyEntity extends BaseEntity {

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp" })
    changedAt: Date
}
