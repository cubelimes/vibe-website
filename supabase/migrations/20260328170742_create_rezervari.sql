-- Creare tabel rezervari
CREATE TABLE rezervari (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefon     TEXT NOT NULL,
  persoane    INT NOT NULL DEFAULT 2,
  data_ora    TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'in asteptare',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: activat dar permitem oricine sa faca orice
ALTER TABLE rezervari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select"  ON rezervari FOR SELECT USING (true);
CREATE POLICY "public_insert"  ON rezervari FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update"  ON rezervari FOR UPDATE USING (true);
CREATE POLICY "public_delete"  ON rezervari FOR DELETE USING (true);
