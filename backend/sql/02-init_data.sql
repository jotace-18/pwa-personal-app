-- == Insertar alimento == --
INSERT INTO alimento (nombre_alimento, tipo, supermercado, precio, calorias) VALUES ('Pechuga de pollo', 'Carne', 'Mercadona', 0.55, 107);

-- == Insertar nutrientes == --
INSERT INTO nutriente (nombre_nutriente, unidad) VALUES
    ('Grasas', 'g'),
    ('Grasas Saturadas', 'g'),
    ('Azúcares', 'g'),
    ('Hidratos de carbono', 'g'),
    ('Fibra', 'g'),
    ('Proteínas', 'g'),
    ('Sal', 'g')
ON CONFLICT (nombre_nutriente) DO NOTHING;


-- == RELACIONAR ALIMENTO CON SUS NUTRIENTES (POR 100g) ==
INSERT INTO alimento_nutriente (id_alimento, id_nutriente, cantidad)
VALUES 
    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Grasas' LIMIT 1), 1.8),

    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Grasas Saturadas' LIMIT 1), 0.6),

    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Hidratos de carbono' LIMIT 1), 0.5),

    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Azúcares' LIMIT 1), 0.0),

    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Fibra' LIMIT 1), 0.0),

    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Proteínas' LIMIT 1), 22),

    ((SELECT id_alimento FROM alimento WHERE nombre_alimento = 'Pechuga de pollo' LIMIT 1), 
     (SELECT id_nutriente FROM nutriente WHERE nombre_nutriente ILIKE 'Sal' LIMIT 1), 0.19);


