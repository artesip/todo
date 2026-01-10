package org.example.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "notes")
@Data
public class Note {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    private String name;

    @Column(name = "description")
    private String desc;

    @Enumerated(EnumType.STRING)
    private NoteStatus status;
}
