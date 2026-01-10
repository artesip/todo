CREATE TABLE IF NOT EXISTS notes
(
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL,
    name        VARCHAR(255),
    description TEXT,
    status      VARCHAR(50) DEFAULT 'NEW',
    CONSTRAINT notes_status_check CHECK (status IN ('NEW', 'IN_PROGRESS', 'DONE', 'ARCHIVE'))
);