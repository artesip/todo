package org.example.service;

import org.example.model.Note;
import org.example.model.NoteStatus;
import org.example.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
public class NoteService {

    @Autowired
    private NoteRepository repository;

    @Transactional(readOnly = true)
    public List<Note> getAllActive() {
        return repository.findAllByStatusNot(NoteStatus.ARCHIVE);
    }

    @Transactional(readOnly = true)
    public List<Note> getArchive() {
        return repository.findAllByStatus(NoteStatus.ARCHIVE);
    }

    @Transactional(readOnly = true)
    public Optional<Note> getById(UUID id) {
        return repository.findById(id);
    }

    @Transactional
    public Note create(Note note) {
        if (note.getStatus() == null) {
            note.setStatus(NoteStatus.NEW);
        }
        return repository.save(note);
    }

    @Transactional
    public Note update(UUID id, Note data) {
        Note note = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
        note.setName(data.getName());
        note.setDesc(data.getDesc());
        note.setStatus(data.getStatus());
        return repository.save(note);
    }

    @Transactional
    public void delete(UUID id) {
        repository.deleteById(id);
    }
}