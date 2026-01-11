"use client";

import { useQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";
import { deleteNote, getArchivedNotes, updateNoteStatus } from "@/lib/api";
import { Todo } from "@/lib/types";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

function ArchiveTodoCard({ todo, refetch }: { todo: Todo, refetch: () => void }) {
  return (
    <Card className="aspect-square flex flex-col justify-between w-55 h-55">
      <CardHeader className="flex flex-row">
        <CardTitle className="text-base line-clamp-2">
          {todo.name}
        </CardTitle>

        <div className="ml-auto cursor-pointer pl-4 pr-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <EllipsisVertical className="h-5 "/>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem
                    onClick={
                        async () => {
                            await updateNoteStatus(todo, 'NEW');
                            refetch();
                        }
                    }
                >
                    Перенести в Todo
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={
                        async () => {
                            await updateNoteStatus(todo, 'DONE');
                            refetch();
                        }
                    }
                >
                    Перенести в Done
                </DropdownMenuItem>
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
        
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground line-clamp-5">
        {todo.desc}
      </CardContent>
    </Card>
  );
}


export function Archive() {
  const { data, isLoading, refetch } = useQuery<Todo[]>({
    queryKey: ["todos-archived"],
    queryFn: getArchivedNotes,
    refetchOnWindowFocus:false,
    refetchInterval:3000,
  });

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <Spinner className="size-8" />
            <span className="text-sm">Загрузка</span>
        </div>   
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Архив пуст
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {data.map((todo) => (
        <ArchiveTodoCard key={todo.id} todo={todo} refetch={refetch}/>
      ))}
    </div>
  );
}
