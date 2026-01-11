"use client";

import { TodoBoard } from "@/components/todo-board";
import { Spinner } from "@/components/ui/spinner";
import { getNotes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";



export function Home() {
    const {data, isLoading, refetch} = useQuery({
        queryKey: ['todos'],
        queryFn: getNotes,
        refetchInterval: 3000,
        refetchOnWindowFocus: false,
    })

    return (
        <main className="p-6 space-y-6 h-[calc(100vh-57px)]">
            {
            isLoading && 
                <div className="flex flex-col items-center justify-center w-full h-full">
                    <Spinner className="size-8" />
                    <span className="text-sm">Загрузка</span>
                </div>
            }

            {
                !isLoading && data &&
                <div className="h-full">
                    <TodoBoard todos={data} refetch={refetch} />
                </div>
            }
        </main>
    )
}