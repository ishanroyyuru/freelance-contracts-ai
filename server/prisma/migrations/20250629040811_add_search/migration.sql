ALTER TABLE "Contract"
  ADD COLUMN tsv tsvector
    GENERATED ALWAYS AS (to_tsvector('english', text)) STORED;

CREATE INDEX idx_contracts_tsv ON "Contract" USING GIN(tsv);