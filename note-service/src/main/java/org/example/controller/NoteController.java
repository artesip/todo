package org.example.controller;

import org.example.model.Note;
import org.example.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> getAll(Authentication authentication) {
        return noteService.getAllActive(authentication.getName());
    }

    @GetMapping("/archive")
    public List<Note> getArchive(Authentication authentication) {
        return noteService.getArchive(authentication.getName());
    }

    @GetMapping("/{id}")
    public Note getById(@PathVariable UUID id, Authentication authentication) {
        return noteService.getById(id, authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Note create(@RequestBody Note note, Authentication authentication) {
        return noteService.create(note, authentication.getName());
    }

    @PutMapping("/{id}")
    public Note update(@PathVariable UUID id, @RequestBody Note data, Authentication authentication) {
        try {
            return noteService.update(id, data, authentication.getName());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id, Authentication authentication) {
        noteService.delete(id, authentication.getName());
    }
}