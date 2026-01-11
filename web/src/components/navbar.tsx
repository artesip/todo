"use client"

import { logout } from "@/lib/api"
import Link from "next/link"

export function Navbar() {

    return (
        <nav className="border-b px-6 py-4 flex">
            <div className="flex gap-8">
                <Link href="/home">Главная</Link>
                <Link href="/archive">Архив</Link>
            </div>
            
            <Link className="ml-auto" href='/' onClick={async () => {await logout()}}>Выйти</Link>
        </nav>
    )
}