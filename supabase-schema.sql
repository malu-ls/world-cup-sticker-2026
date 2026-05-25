-- =============================================
-- ÁLBUM COPA 2026 — Schema Supabase
-- Execute no SQL Editor do painel do Supabase
-- =============================================

-- Tabela principal de figurinhas por usuário
CREATE TABLE IF NOT EXISTS public.stickers (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sticker_code TEXT NOT NULL,           -- ex: "BRA1", "ARG10", "SPEC5"
  quantity    integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  updated_at  timestamptz DEFAULT now(),
  UNIQUE(user_id, sticker_code)
);

-- Tabela de cards de troca gerados
CREATE TABLE IF NOT EXISTS public.trade_cards (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url   text,                     -- URL no Supabase Storage
  sticker_list jsonb,                   -- snapshot das repetidas no momento
  created_at  timestamptz DEFAULT now()
);

-- =============================================
-- Row Level Security (RLS)
-- Cada usuário acessa SÓ os próprios dados
-- =============================================

ALTER TABLE public.stickers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_cards ENABLE ROW LEVEL SECURITY;

-- Políticas para stickers
CREATE POLICY "Usuário lê próprias figurinhas"
  ON public.stickers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário insere próprias figurinhas"
  ON public.stickers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza próprias figurinhas"
  ON public.stickers FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário deleta próprias figurinhas"
  ON public.stickers FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para trade_cards
CREATE POLICY "Usuário lê próprios cards"
  ON public.trade_cards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário cria próprios cards"
  ON public.trade_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário deleta próprios cards"
  ON public.trade_cards FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- Índices para performance
-- =============================================

CREATE INDEX IF NOT EXISTS stickers_user_id_idx ON public.stickers(user_id);
CREATE INDEX IF NOT EXISTS stickers_code_idx ON public.stickers(sticker_code);
CREATE INDEX IF NOT EXISTS trade_cards_user_id_idx ON public.trade_cards(user_id);

-- =============================================
-- Função para atualizar updated_at automaticamente
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stickers_updated_at
  BEFORE UPDATE ON public.stickers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- Storage bucket para cards de troca
-- =============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-cards', 'trade-cards', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Cards são públicos para leitura"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'trade-cards');

CREATE POLICY "Usuário faz upload do próprio card"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'trade-cards' AND auth.uid()::text = (storage.foldername(name))[1]);
