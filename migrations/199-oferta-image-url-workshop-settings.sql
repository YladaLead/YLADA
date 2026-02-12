-- Imagem que acompanha a mensagem de parabéns/oferta (link após participou da aula)
ALTER TABLE whatsapp_workshop_settings
  ADD COLUMN IF NOT EXISTS oferta_image_url TEXT;

COMMENT ON COLUMN whatsapp_workshop_settings.oferta_image_url IS 'URL da imagem enviada junto à mensagem de parabéns + link de oferta (pt/nutri#oferta). Se preenchida, a mensagem é enviada como imagem com legenda em vez de só texto.';
