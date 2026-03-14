CREATE TABLE citizens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nin_hash        VARCHAR(66) NOT NULL UNIQUE,
    name            VARCHAR(255) NOT NULL,
    parish          VARCHAR(100) NOT NULL,
    date_of_birth   DATE NOT NULL,
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
INSERT INTO citizens (nin_hash, name, parish, date_of_birth, jamdex_balance, verified) VALUES
    ('0x669af244344d36cb726c57b71d07807c43ce7894f1d51941d1d6bab00aa6fb58', 'Marcus Thompson',  'Kingston',     '1990-03-15', 25000, true),
    ('0x3319c1feeac9b1d9d19da7ca1f9d6d96286248817823d4c06b93c58f2856496a', 'Keisha Williams',  'St. Andrew',   '1985-07-22', 42000, true),
    ('0xa2e27d62f9b488f3b6957885fdba49dcb714fab2d319e805d136e6cc53f14f84', 'Andre Campbell',   'Montego Bay',  '1992-11-08', 15500, true)
ON CONFLICT (nin_hash) DO NOTHING;
