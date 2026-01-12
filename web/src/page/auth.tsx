"use client";

import LoginForm from "@/components/login-form"
import RegistrationForm from "@/components/registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function Auth() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
        <Tabs defaultValue="account" className="w-100">
            <TabsList>
                <TabsTrigger value="account">Вход</TabsTrigger>
                <TabsTrigger value="password">Регистрация</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardTitle>Вход в аккаунт</CardTitle>
                        <CardDescription>
                            Введите ваш логин и пароль чтобы войти
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm/>
                    </CardContent>
                </Card>

            </TabsContent>
            <TabsContent value="password">
                <Card>
                    <CardHeader>
                        <CardTitle>Регистрация</CardTitle>
                        <CardDescription>
                            Введите логин и пароль чтобы зарегистрироваться
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegistrationForm/>   
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
        </div>
        
    )
}