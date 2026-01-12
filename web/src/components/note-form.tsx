"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { noteSchema, NoteFormValues } from "@/lib/validators/note";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TodoStatus } from "@/lib/types";
import { NoteStatusSelect } from "./status-select";
import { createNote, getNotes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

type NotesFormProps = {
    defaultStatus?: TodoStatus
    setIsOpen: (b: boolean) => void
}

export default function NotesForm({defaultStatus, setIsOpen}: NotesFormProps) {
  const { refetch } = useQuery({
          queryKey: ['todos'],
          queryFn: getNotes,
          refetchOnWindowFocus: false,
          enabled: false,
  })

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      name: "",
      desc: "",
      status: defaultStatus,
    },
  });

  const onSubmit = async (values: NoteFormValues) => {
    await createNote(values);
    refetch();
  };

  return (
    <Form {...form}>
      <form
       className="grid gap-4"
       onSubmit={form.handleSubmit((values) => {
        onSubmit(values);
        setIsOpen(false);
      })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel htmlFor="name">Имя</FormLabel>
              <FormControl>
                <Input id="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel htmlFor="description">Описание</FormLabel>
              <FormControl>
                <Input id="description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <FormLabel>Статус</FormLabel>
              <FormControl>
                <NoteStatusSelect
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="cursor-pointer">
          Создать
        </Button>
      </form>
    </Form>
  );
}