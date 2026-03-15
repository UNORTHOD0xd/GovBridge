CREATE TABLE citizens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nin_hash        VARCHAR(66) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    parish          VARCHAR(100) NOT NULL,
    date_of_birth   DATE NOT NULL,
    gender          VARCHAR(10),
    trn             VARCHAR(9),
    address         VARCHAR(255),
    enrollment_date DATE,
    card_expiry     DATE,
    jamdex_balance  BIGINT NOT NULL DEFAULT 0,
    verified        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citizens_nin_hash ON citizens(nin_hash);

DO $$ BEGIN
    CREATE TYPE service_status AS ENUM ('submitted','processing','approved','issued','rejected');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_type AS ENUM ('tax_compliance','birth_cert','police_record');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE service_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id      UUID NOT NULL REFERENCES citizens(id),
    service_type    service_type NOT NULL,
    agency          VARCHAR(50) NOT NULL,
    status          service_status NOT NULL DEFAULT 'submitted',
    fee_amount      BIGINT NOT NULL DEFAULT 0,
    doc_hash        VARCHAR(66),
    chain_tx_hash   VARCHAR(66),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_citizen ON service_requests(citizen_id);

CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id      UUID NOT NULL REFERENCES service_requests(id),
    citizen_id      UUID NOT NULL REFERENCES citizens(id),
    amount          BIGINT NOT NULL,
    receipt_id      VARCHAR(66),
    chain_tx_hash   VARCHAR(66),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE documents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id      UUID NOT NULL REFERENCES service_requests(id),
    citizen_id      UUID NOT NULL REFERENCES citizens(id),
    doc_hash        VARCHAR(66) NOT NULL UNIQUE,
    doc_type        service_type NOT NULL,
    agency          VARCHAR(50) NOT NULL,
    chain_tx_hash   VARCHAR(66),
    block_number    BIGINT,
    issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_hash ON documents(doc_hash);

-- Seed demo citizens
-- NIN hashes are pre-computed SHA-256 of the raw NIN string
-- NINs: 100100100, 100200200, 100300300
INSERT INTO citizens (nin_hash, name, parish, date_of_birth, gender, trn, address, enrollment_date, card_expiry, jamdex_balance, verified) VALUES
    ('0x95b4f55d1e9f5a0b5252a43e7b95e4df9e7777ec04e3e9d4ed7331d5e16fee85', 'Marcus Thompson',  'Kingston',     '1990-03-15', 'Male',   '100100100', '14 Hope Road, Kingston 6',            '2024-01-10', '2034-01-10', 25000, true),
    ('0x0c6766cdb5db0cf7edb80a7d283f999e946070783c1ea94757af553596a1f9a9', 'Keisha Williams',  'St. Andrew',   '1985-07-22', 'Female', '100200200', '27 Constant Spring Road, St. Andrew', '2024-03-05', '2034-03-05', 42000, true),
    ('0x0e8e80ba7d8a9702d21303e0565988ee68cc56ff7224c9520401929c68356d5b', 'Andre Campbell',   'St. James',    '1992-11-08', 'Male',   '100300300', '5 Gloucester Avenue, Montego Bay',    '2024-06-18', '2034-06-18', 15500, true)
ON CONFLICT (nin_hash) DO NOTHING;
