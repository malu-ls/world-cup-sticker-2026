-- ═══════════════════════════════════════════════════════════════
-- BOLÃO DA COPA 2026 — Schema Supabase
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- ═══════════════════════════════════════════════════════════════

-- Perfis de usuários (nome/avatar para o ranking)
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: cria perfil automaticamente ao cadastrar
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- RLS profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_upsert" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- ─── Tabela de jogos ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bolao_matches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage           TEXT NOT NULL CHECK (stage IN ('group','r32','r16','qf','sf','3rd','final')),
  group_name      TEXT,        -- 'A'..'L' apenas para fase de grupos
  matchday        INTEGER,     -- 1, 2 ou 3 na fase de grupos
  match_number    INTEGER,     -- número sequencial do jogo
  home_team       TEXT,        -- código da seleção (ex: 'BRA') ou 'TBD'
  away_team       TEXT,
  match_date      TIMESTAMPTZ,
  venue           TEXT,
  city            TEXT,
  home_score      INTEGER,     -- NULL até o jogo terminar
  away_score      INTEGER,
  home_score_pens INTEGER,     -- gols nos pênaltis (eliminatórias)
  away_score_pens INTEGER,
  status          TEXT NOT NULL DEFAULT 'scheduled'
                  CHECK (status IN ('scheduled','live','finished')),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bolao_matches_stage    ON bolao_matches(stage);
CREATE INDEX IF NOT EXISTS idx_bolao_matches_group    ON bolao_matches(group_name);
CREATE INDEX IF NOT EXISTS idx_bolao_matches_status   ON bolao_matches(status);
CREATE INDEX IF NOT EXISTS idx_bolao_matches_date     ON bolao_matches(match_date);

-- Trigger: atualiza updated_at
CREATE OR REPLACE FUNCTION update_bolao_match_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS trg_bolao_match_updated ON bolao_matches;
CREATE TRIGGER trg_bolao_match_updated
  BEFORE UPDATE ON bolao_matches
  FOR EACH ROW EXECUTE FUNCTION update_bolao_match_timestamp();

-- RLS jogos
ALTER TABLE bolao_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_select"       ON bolao_matches FOR SELECT TO authenticated USING (true);
CREATE POLICY "matches_insert_admin" ON bolao_matches FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() ->> 'email') = 'malulopes232510@gmail.com');
CREATE POLICY "matches_update_admin" ON bolao_matches FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'malulopes232510@gmail.com');
CREATE POLICY "matches_delete_admin" ON bolao_matches FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'malulopes232510@gmail.com');

-- ─── Tabela de palpites ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bolao_predictions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id        UUID NOT NULL REFERENCES bolao_matches(id) ON DELETE CASCADE,
  home_score      INTEGER NOT NULL CHECK (home_score >= 0),
  away_score      INTEGER NOT NULL CHECK (away_score >= 0),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, match_id)
);

CREATE INDEX IF NOT EXISTS idx_bolao_preds_user  ON bolao_predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_bolao_preds_match ON bolao_predictions(match_id);

-- Trigger: atualiza updated_at
DROP TRIGGER IF EXISTS trg_bolao_pred_updated ON bolao_predictions;
CREATE TRIGGER trg_bolao_pred_updated
  BEFORE UPDATE ON bolao_predictions
  FOR EACH ROW EXECUTE FUNCTION update_bolao_match_timestamp();

-- RLS palpites: usuário vê/edita só os seus; todos autenticados veem todos (para ranking)
ALTER TABLE bolao_predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "preds_select_all"  ON bolao_predictions FOR SELECT TO authenticated USING (true);
CREATE POLICY "preds_insert_own"  ON bolao_predictions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "preds_update_own"  ON bolao_predictions FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "preds_delete_own"  ON bolao_predictions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED: Fase de Grupos — 72 jogos (só insere se a tabela estiver vazia)
-- ═══════════════════════════════════════════════════════════════════════════════
DO $$
BEGIN
IF NOT EXISTS (SELECT 1 FROM bolao_matches LIMIT 1) THEN

INSERT INTO bolao_matches (stage,group_name,matchday,match_number,home_team,away_team,match_date,venue,city,status) VALUES
-- ── GRUPO A (MEX · RSA · KOR · CZE) ──────────────────────────────────────────
('group','A',1, 1,'MEX','RSA','2026-06-11T14:00:00Z','Estadio Azteca','Cidade do México','scheduled'),
('group','A',1, 2,'KOR','CZE','2026-06-11T18:00:00Z','Estadio BBVA','Monterrey','scheduled'),
('group','A',2, 3,'MEX','KOR','2026-06-17T14:00:00Z','Estadio BBVA','Monterrey','scheduled'),
('group','A',2, 4,'RSA','CZE','2026-06-17T18:00:00Z','Estadio Azteca','Cidade do México','scheduled'),
('group','A',3, 5,'MEX','CZE','2026-06-24T20:00:00Z','Estadio Azteca','Cidade do México','scheduled'),
('group','A',3, 6,'RSA','KOR','2026-06-24T20:00:00Z','Estadio BBVA','Monterrey','scheduled'),
-- ── GRUPO B (CAN · BIH · QAT · SUI) ──────────────────────────────────────────
('group','B',1, 7,'CAN','BIH','2026-06-11T16:00:00Z','BC Place','Vancouver','scheduled'),
('group','B',1, 8,'QAT','SUI','2026-06-11T20:00:00Z','BMO Field','Toronto','scheduled'),
('group','B',2, 9,'CAN','QAT','2026-06-17T16:00:00Z','BMO Field','Toronto','scheduled'),
('group','B',2,10,'BIH','SUI','2026-06-17T20:00:00Z','BC Place','Vancouver','scheduled'),
('group','B',3,11,'CAN','SUI','2026-06-24T21:00:00Z','BC Place','Vancouver','scheduled'),
('group','B',3,12,'BIH','QAT','2026-06-24T21:00:00Z','BMO Field','Toronto','scheduled'),
-- ── GRUPO C (BRA · MAR · HAI · SCO) ──────────────────────────────────────────
('group','C',1,13,'BRA','MAR','2026-06-12T14:00:00Z','SoFi Stadium','Los Angeles','scheduled'),
('group','C',1,14,'HAI','SCO','2026-06-12T18:00:00Z','Hard Rock Stadium','Miami','scheduled'),
('group','C',2,15,'BRA','HAI','2026-06-18T14:00:00Z','Hard Rock Stadium','Miami','scheduled'),
('group','C',2,16,'MAR','SCO','2026-06-18T18:00:00Z','SoFi Stadium','Los Angeles','scheduled'),
('group','C',3,17,'BRA','SCO','2026-06-25T20:00:00Z','SoFi Stadium','Los Angeles','scheduled'),
('group','C',3,18,'MAR','HAI','2026-06-25T20:00:00Z','Hard Rock Stadium','Miami','scheduled'),
-- ── GRUPO D (USA · PAR · AUS · TUR) ──────────────────────────────────────────
('group','D',1,19,'USA','PAR','2026-06-12T16:00:00Z','AT&T Stadium','Arlington','scheduled'),
('group','D',1,20,'AUS','TUR','2026-06-12T20:00:00Z','Arrowhead Stadium','Kansas City','scheduled'),
('group','D',2,21,'USA','AUS','2026-06-18T16:00:00Z','Arrowhead Stadium','Kansas City','scheduled'),
('group','D',2,22,'PAR','TUR','2026-06-18T20:00:00Z','AT&T Stadium','Arlington','scheduled'),
('group','D',3,23,'USA','TUR','2026-06-25T21:00:00Z','AT&T Stadium','Arlington','scheduled'),
('group','D',3,24,'PAR','AUS','2026-06-25T21:00:00Z','Arrowhead Stadium','Kansas City','scheduled'),
-- ── GRUPO E (GER · CUW · CIV · ECU) ──────────────────────────────────────────
('group','E',1,25,'GER','CUW','2026-06-13T14:00:00Z','MetLife Stadium','Nova York','scheduled'),
('group','E',1,26,'CIV','ECU','2026-06-13T18:00:00Z','Lincoln Financial Field','Filadélfia','scheduled'),
('group','E',2,27,'GER','CIV','2026-06-19T14:00:00Z','Lincoln Financial Field','Filadélfia','scheduled'),
('group','E',2,28,'CUW','ECU','2026-06-19T18:00:00Z','MetLife Stadium','Nova York','scheduled'),
('group','E',3,29,'GER','ECU','2026-06-26T20:00:00Z','MetLife Stadium','Nova York','scheduled'),
('group','E',3,30,'CUW','CIV','2026-06-26T20:00:00Z','Lincoln Financial Field','Filadélfia','scheduled'),
-- ── GRUPO F (NED · JPN · SWE · TUN) ──────────────────────────────────────────
('group','F',1,31,'NED','JPN','2026-06-13T16:00:00Z','Levi''s Stadium','San Francisco','scheduled'),
('group','F',1,32,'SWE','TUN','2026-06-13T20:00:00Z','Lumen Field','Seattle','scheduled'),
('group','F',2,33,'NED','SWE','2026-06-19T16:00:00Z','Lumen Field','Seattle','scheduled'),
('group','F',2,34,'JPN','TUN','2026-06-19T20:00:00Z','Levi''s Stadium','San Francisco','scheduled'),
('group','F',3,35,'NED','TUN','2026-06-26T21:00:00Z','Levi''s Stadium','San Francisco','scheduled'),
('group','F',3,36,'JPN','SWE','2026-06-26T21:00:00Z','Lumen Field','Seattle','scheduled'),
-- ── GRUPO G (BEL · EGY · IRN · NZL) ──────────────────────────────────────────
('group','G',1,37,'BEL','EGY','2026-06-14T14:00:00Z','Rose Bowl','Pasadena','scheduled'),
('group','G',1,38,'IRN','NZL','2026-06-14T18:00:00Z','State Farm Stadium','Glendale','scheduled'),
('group','G',2,39,'BEL','IRN','2026-06-20T14:00:00Z','State Farm Stadium','Glendale','scheduled'),
('group','G',2,40,'EGY','NZL','2026-06-20T18:00:00Z','Rose Bowl','Pasadena','scheduled'),
('group','G',3,41,'BEL','NZL','2026-06-27T20:00:00Z','Rose Bowl','Pasadena','scheduled'),
('group','G',3,42,'EGY','IRN','2026-06-27T20:00:00Z','State Farm Stadium','Glendale','scheduled'),
-- ── GRUPO H (ESP · CPV · KSA · URU) ──────────────────────────────────────────
('group','H',1,43,'ESP','CPV','2026-06-14T16:00:00Z','Estadio Universitario','Monterrey','scheduled'),
('group','H',1,44,'KSA','URU','2026-06-14T20:00:00Z','Estadio Akron','Guadalajara','scheduled'),
('group','H',2,45,'ESP','KSA','2026-06-20T16:00:00Z','Estadio Akron','Guadalajara','scheduled'),
('group','H',2,46,'CPV','URU','2026-06-20T20:00:00Z','Estadio Universitario','Monterrey','scheduled'),
('group','H',3,47,'ESP','URU','2026-06-27T21:00:00Z','Estadio Universitario','Monterrey','scheduled'),
('group','H',3,48,'CPV','KSA','2026-06-27T21:00:00Z','Estadio Akron','Guadalajara','scheduled'),
-- ── GRUPO I (FRA · SEN · IRQ · NOR) ──────────────────────────────────────────
('group','I',1,49,'FRA','SEN','2026-06-15T14:00:00Z','Gillette Stadium','Boston','scheduled'),
('group','I',1,50,'IRQ','NOR','2026-06-15T18:00:00Z','NRG Stadium','Houston','scheduled'),
('group','I',2,51,'FRA','IRQ','2026-06-21T14:00:00Z','NRG Stadium','Houston','scheduled'),
('group','I',2,52,'SEN','NOR','2026-06-21T18:00:00Z','Gillette Stadium','Boston','scheduled'),
('group','I',3,53,'FRA','NOR','2026-06-28T20:00:00Z','Gillette Stadium','Boston','scheduled'),
('group','I',3,54,'SEN','IRQ','2026-06-28T20:00:00Z','NRG Stadium','Houston','scheduled'),
-- ── GRUPO J (ARG · ALG · AUT · JOR) ──────────────────────────────────────────
('group','J',1,55,'ARG','ALG','2026-06-15T16:00:00Z','Mercedes-Benz Stadium','Atlanta','scheduled'),
('group','J',1,56,'AUT','JOR','2026-06-15T20:00:00Z','Bank of America Stadium','Charlotte','scheduled'),
('group','J',2,57,'ARG','AUT','2026-06-21T16:00:00Z','Bank of America Stadium','Charlotte','scheduled'),
('group','J',2,58,'ALG','JOR','2026-06-21T20:00:00Z','Mercedes-Benz Stadium','Atlanta','scheduled'),
('group','J',3,59,'ARG','JOR','2026-06-28T21:00:00Z','Mercedes-Benz Stadium','Atlanta','scheduled'),
('group','J',3,60,'ALG','AUT','2026-06-28T21:00:00Z','Bank of America Stadium','Charlotte','scheduled'),
-- ── GRUPO K (POR · COD · UZB · COL) ──────────────────────────────────────────
('group','K',1,61,'POR','COD','2026-06-16T14:00:00Z','Camping World Stadium','Orlando','scheduled'),
('group','K',1,62,'UZB','COL','2026-06-16T18:00:00Z','Raymond James Stadium','Tampa','scheduled'),
('group','K',2,63,'POR','UZB','2026-06-22T14:00:00Z','Raymond James Stadium','Tampa','scheduled'),
('group','K',2,64,'COD','COL','2026-06-22T18:00:00Z','Camping World Stadium','Orlando','scheduled'),
('group','K',3,65,'POR','COL','2026-06-29T20:00:00Z','Camping World Stadium','Orlando','scheduled'),
('group','K',3,66,'COD','UZB','2026-06-29T20:00:00Z','Raymond James Stadium','Tampa','scheduled'),
-- ── GRUPO L (ENG · CRO · GHA · PAN) ──────────────────────────────────────────
('group','L',1,67,'ENG','CRO','2026-06-16T16:00:00Z','SoFi Stadium','Los Angeles','scheduled'),
('group','L',1,68,'GHA','PAN','2026-06-16T20:00:00Z','BC Place','Vancouver','scheduled'),
('group','L',2,69,'ENG','GHA','2026-06-22T16:00:00Z','BC Place','Vancouver','scheduled'),
('group','L',2,70,'CRO','PAN','2026-06-22T20:00:00Z','SoFi Stadium','Los Angeles','scheduled'),
('group','L',3,71,'ENG','PAN','2026-06-29T21:00:00Z','SoFi Stadium','Los Angeles','scheduled'),
('group','L',3,72,'CRO','GHA','2026-06-29T21:00:00Z','BC Place','Vancouver','scheduled');

END IF;
END $$;
