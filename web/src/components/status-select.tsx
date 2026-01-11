import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";

type NoteStatusSelectProps = {
  value?: string;
  onValueChange?: (value: string) => void;
}

export function NoteStatusSelect({value, onValueChange}:NoteStatusSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Выберите статус" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Статус</SelectLabel>
          <SelectItem value="NEW">Todo</SelectItem>
          <SelectItem value="DONE">Done</SelectItem>
          <SelectItem value="ARCHIVE">Архив</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}