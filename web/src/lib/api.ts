import { toast } from "sonner";
import { AuthFormValues } from "./validators/auth";
import { Todo, TodoStatus } from "./types";
import { NoteFormValues } from "./validators/note";

export async function login(data: AuthFormValues) {
    return await fetch('/auth/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
}

export async function logout() {
    return await fetch('/auth/auth/logout', {
        method: 'POST',
    })
}

export async function registration(data: AuthFormValues) {
    return await fetch('/auth/auth/registration', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
}

export async function getNotes(): Promise<Todo[]> {
    const res = await fetch('/apii/api/notes',
        {
            method: 'GET',
        }
    )

    const data = await res.json()

    if (!res.ok) {
        toast.error(data.message)
        return [];
    }

    return data;
}

export async function getArchivedNotes(): Promise<Todo[]> {
    const res = await fetch('/apii/api/notes/archive',
        {
            method: 'GET',
        }
    )

    const data = await res.json()

    if (!res.ok) {
        toast.error(data.message)
        return [];
    }

    return data;
}

export async function createNote(todo: NoteFormValues) {
    console.log(todo)
    
    return await fetch('/apii/api/notes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo)
    })
}


export async function updateNoteStatus(todo: Todo, status: TodoStatus) {
    todo.status = status

    return await fetch('/apii/api/notes/' + todo.id, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(todo)
    })
}

export async function deleteNote(id:string) {
    return await fetch('/apii/api/notes/' + id, {
        method: 'DELETE',
    })
}