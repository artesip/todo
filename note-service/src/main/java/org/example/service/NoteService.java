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
    public List<Note> getAllActive(String userId) {
        return repository.findAllByUserIdAndStatusNot(UUID.fromString(userId), NoteStatus.ARCHIVE);
    }

    @Transactional(readOnly = true)
    public List<Note> getArchive(String userId) {
        return repository.findAllByUserIdAndStatus(UUID.fromString(userId), NoteStatus.ARCHIVE);
    }

    @Transactional(readOnly = true)
    public Optional<Note> getById(UUID id, String userId) {
        return repository.findByIdAndUserId(id, UUID.fromString(userId));
    }

    @Transactional
    public Note create(Note note, String userId) {
        note.setUserId(UUID.fromString(userId));
        if (note.getStatus() == null) {
            note.setStatus(NoteStatus.NEW);
        }
        return repository.save(note);
    }

    @Transactional
    public Note update(UUID id, Note data, String userId) {
        Note note = repository.findByIdAndUserId(id, UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("Note not found or access denied"));

        note.setName(data.getName());
        note.setDesc(data.getDesc());
        note.setStatus(data.getStatus());

        return repository.save(note);
    }

    @Transactional
    public void delete(UUID id, String userId) {
        Note note = repository.findByIdAndUserId(id, UUID.fromString(userId))
                .orElseThrow(() -> new RuntimeException("Note not found or access denied"));
        repository.delete(note);
    }
}