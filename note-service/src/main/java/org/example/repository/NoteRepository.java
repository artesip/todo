package org.example.repository;

import org.example.model.Note;
import org.example.model.NoteStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NoteRepository extends JpaRepository<Note, UUID> {
    List<Note> findAllByUserIdAndStatusNot(UUID userId, NoteStatus status);
    List<Note> findAllByUserIdAndStatus(UUID userId, NoteStatus status);
    Optional<Note> findByIdAndUserId(UUID id, UUID userId);
}