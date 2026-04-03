-- TABLA: completed_dates
-- Almacena el progreso de las 100 citas
CREATE TABLE completed_dates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  description TEXT,
  photo_url TEXT,
  date_executed DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS (Seguridad a nivel de fila)
ALTER TABLE completed_dates ENABLE ROW LEVEL SECURITY;

-- Políticas para que cada usuario vea/edite solo lo suyo (o ambos si quieres compartido)
-- Si es compartido:
CREATE POLICY "Compartido entre la pareja" ON completed_dates
  FOR ALL USING (true) WITH CHECK (true);

-- TABLA: gallery_images
-- Almacena las fotos de la galería compartida
CREATE TABLE gallery_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uploader_id UUID REFERENCES auth.users(id),
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Galería pública" ON gallery_images FOR ALL USING (true);

-- TABLA: trip_todos
-- Almacena los planes para el viaje a Lima
CREATE TABLE trip_todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE trip_todos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Planes de viaje públicos" ON trip_todos FOR ALL USING (true);

-- SEMILLAS (Datos iniciales para el viaje a Lima)
INSERT INTO trip_todos (text) VALUES 
('Comer Ceviche en Miraflores'),
('Atardecer en el Malecón'),
('Puente de los Suspiros en Barranco'),
('Circuito Mágico del Agua');

-- POLÍTICAS DE STORAGE (Para el bucket 'galley')
-- Nota: Ejecuta esto si el bucket se llama 'galley'
insert into storage.buckets (id, name, public) values ('galley', 'galley', true) on conflict (id) do nothing;

create policy "Acceso público galerías" on storage.objects for select using ( bucket_id = 'galley' );
create policy "Cualquiera puede subir fotos" on storage.objects for insert with check ( bucket_id = 'galley' );
create policy "Solo dueños pueden borrar" on storage.objects for delete using ( bucket_id = 'galley' AND auth.uid() = owner );
create policy "Cualquiera puede actualizar fotos" on storage.objects for update using ( bucket_id = 'galley' );
