-- =====================================================
-- ADICIONAR SUPORTE A MÚLTIPLAS ÁREAS POR CURSO (MATERIAL)
-- =====================================================
-- Permite que um curso apareça em múltiplas áreas (wellness, nutri, coach, nutra)

-- Tabela de relacionamento many-to-many entre materiais e áreas
CREATE TABLE IF NOT EXISTS curso_materiais_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES wellness_curso_materiais(id) ON DELETE CASCADE,
  area VARCHAR(50) NOT NULL CHECK (area IN ('wellness', 'nutri', 'coach', 'nutra')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(material_id, area) -- Evitar duplicatas
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_curso_materiais_areas_material ON curso_materiais_areas(material_id);
CREATE INDEX IF NOT EXISTS idx_curso_materiais_areas_area ON curso_materiais_areas(area);

-- Comentários
COMMENT ON TABLE curso_materiais_areas IS 'Relacionamento many-to-many entre cursos (materiais) e áreas';
COMMENT ON COLUMN curso_materiais_areas.material_id IS 'ID do material/curso';
COMMENT ON COLUMN curso_materiais_areas.area IS 'Área: wellness, nutri, coach ou nutra';

