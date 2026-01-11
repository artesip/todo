export type TodoStatus = "NEW" | "DONE" | "ARCHIVE"

export interface Todo {
    id: string
    name: string
    desc: string
    status: TodoStatus
}