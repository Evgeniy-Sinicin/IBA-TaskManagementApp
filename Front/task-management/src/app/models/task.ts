export enum Priority {
    Usual,
    Important,
    Critical,
}

export class Task {
    isNeedNotify!: Boolean
    priority!: Priority
    id!: string
    name!: string
    description!: string
    userEmail!: string
    startDate!: Date
    finishDate!: Date
}