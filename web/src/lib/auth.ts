import { cookies } from "next/headers"

export async function isAuthenticated(): Promise<boolean> {
    return Boolean((await cookies()).get("auth"))
}