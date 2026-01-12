"use client"

import { logout } from "@/lib/api"
import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
    const router = useRouter()
    const queryClient = useQueryClient();

    
    return (
        <nav className="border-b px-6 py-4 flex">
            <div className="flex gap-8">
                <Link href="/home">Главная</Link>
                <Link href="/archive">Архив</Link>
            </div>
            
            <button
              className="ml-auto cursor-pointer"
              onClick={async () => {
                  await logout();
                  queryClient.clear();
                  router.replace('/');
              }}
              >
              Выйти
            </button>
        </nav>
    )
}