import { Todo, TodoStatus } from "@/lib/types";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Check, EllipsisVertical } from "lucide-react";
import { deleteNote, updateNoteStatus } from "@/lib/api";
import { NoteDialogCreation } from "./note-create-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


type TodoBoardProps = {
  todos: Todo[];
  refetch: () => void
}

export function TodoBoard({ todos, refetch }: TodoBoardProps) {
  const [todoList, setTodoList] = useState<Todo[]>(todos);
  const [draggingTodo, setDraggingTodo] = useState<Todo | null>(null);
  const [showArchiveZone, setShowArchiveZone] = useState(false);

  const handleDragStart = (todo: Todo) => {
    setDraggingTodo(todo);
    setShowArchiveZone(true);
  };

  const handleDragEnd = () => {
    setDraggingTodo(null);
    setShowArchiveZone(false);
  };

  const handleDrop = async (status: TodoStatus) => {
    if (!draggingTodo) return;
    const updatedTodo = { ...draggingTodo, status };
    setTodoList((prev) =>
      prev.map((t) => (t.id === draggingTodo.id ? updatedTodo : t))
    );
    updateNoteStatus(draggingTodo, status);
    handleDragEnd();
  };

  const handleArchiveDrop = async () => {
    if (!draggingTodo) return;
    setTodoList((prev) => prev.filter((t) => t.id !== draggingTodo.id));

    updateNoteStatus(draggingTodo, 'ARCHIVE');

    handleDragEnd();
  };

  useEffect(() => {
    setTodoList(todos);
  }, [todos]);

  const renderTodoItem = (todo: Todo) => (
    <div
      key={todo.id}
      className="todo-item"
      draggable
      onDragStart={() => handleDragStart(todo)}
      onDragEnd={handleDragEnd}
    >
        <div className="flex flex-row gap-2">
            <Badge variant='outline' className="flex items-center justify-center gap-1">
                {todo.status.toLowerCase() === "new" ? (
                "Todo"
                ) : (
                <>
                    <Check className="w-4 h-4 text-green-600" />
                    Done
                </>
                )}
            </Badge>
            <h4>{todo.name}</h4>
            
            <div className="ml-auto cursor-pointer pl-4 pr-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical className="h-5 "/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuItem
                        onClick={
                            async () => {
                             await deleteNote(todo.id);
                             refetch();
                            }
                        }
                    >
                      Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
                
            </div>
        </div>
        
      <p className="text-sm mt-2">{todo.desc}</p>
    </div>
  );

  return (
    <div className="todo-board h-full">
      <div
        className="todo-column bg-amber-50 shadow-xl"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop('NEW')}
      >
        <div className="flex flex-row column-header mb-2">
          <h3>Todo</h3>
          
          <div className="ml-auto">
            <NoteDialogCreation status="NEW"/>
          </div>
        </div>
        {todoList.filter((t) => t.status.toLowerCase() === "new").map(renderTodoItem)}
      </div>

      <div
        className="todo-column bg-green-50 shadow-xl"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop("DONE")}
      >
        <div className="flex flex-row column-header mb-2">
          <h3>Done</h3>

          <div className="ml-auto">
            <NoteDialogCreation status="DONE"/>
          </div>
        </div>
        {todoList.filter((t) => t.status.toLowerCase() === "done").map(renderTodoItem)}
      </div>

      {
        showArchiveZone && (
            <div
            className="archive-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleArchiveDrop}
            >
            Перетащите сюда для архивирования
            </div>
        )
      }
    </div>
  );
};
