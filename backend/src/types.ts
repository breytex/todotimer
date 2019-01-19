import { Response } from 'express'
import { Request } from 'express'
import { Session } from './entity/Session'
import { Project, User } from './entity/User'

declare module 'express' {
    interface Request {
        user?: User
    }
}

export interface MyContext {
    request: Request
    response: Response
    user?: User
    session?: Session
} 