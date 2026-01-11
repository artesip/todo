import { PlusIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { TodoStatus } from "@/lib/types";
import NotesForm from "./note-form";
import { useState } from "react";

type DialogDemoProps = {
    status?: TodoStatus
}

export function NoteDialogCreation({status}: DialogDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <PlusIcon className="ml-auto cursor-pointer w-5" onClick={() => setIsOpen(true)}/>
        </DialogTrigger>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Создать карточку</DialogTitle>
          </DialogHeader>

          <NotesForm defaultStatus={status} setIsOpen={setIsOpen}/>
        </DialogContent>
    </Dialog>
  )
}