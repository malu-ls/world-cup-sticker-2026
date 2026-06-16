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
