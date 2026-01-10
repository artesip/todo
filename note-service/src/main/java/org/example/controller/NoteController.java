package org.example.controller;

import org.example.model.Note;
import org.example.model.NoteStatus;
import org.example.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteRepository repository;

    @GetMapping
    public List<Note> getAll() {
        return repository.findAllByStatusNot(NoteStatus.ARCHIVE);
    }

    @GetMapping("/archive")
    public List<Note> getArchive() {
        return repository.findAllByStatus(NoteStatus.ARCHIVE);
    }

    @GetMapping("/{id}")
    public Note getById(@PathVariable UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable UUID id, @RequestBody Note data) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));

        note.setName(data.getName());
        note.setDesc(data.getDesc());
        note.setStatus(data.getStatus());
        return repository.save(note);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Note create(@RequestBody Note note) {
        if (note.getStatus() == null) {
            note.setStatus(NoteStatus.NEW);
        }

        return repository.save(note);
    }
}