package org.example.repository;

import org.example.model.Note;
import org.example.model.NoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {
    List<Note> findAllByStatusNot(NoteStatus status);
    List<Note> findAllByStatus(NoteStatus status);
}