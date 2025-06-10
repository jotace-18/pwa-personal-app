import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Alimento {
  id_alimento: number;
  nombre_alimento: string;
}

interface Receta {
  id_receta: number;
  nombre: string;
}

type SeleccionItemTipo = "alimento" | "receta";

interface SeleccionItem {
  id: number;
  nombre: string;
  cantidad: number;
  tipo: SeleccionItemTipo;
}

interface SeleccionComida {
  alimentos: SeleccionItem[];
  recetas: SeleccionItem[];
}

interface Estadisticas {
  calorias: number;
  nutrientes: Record<string, number>;
}

interface DietaContenido {
  alimentos?: { id: number; nombre: string; cantidad: number }[];
  recetas?: { id: number; nombre: string; cantidad: number }[];
}

interface AlimentoDetalle {
  calorias: number;
  nutrientes?: { nombre_nutriente: string; cantidad: number }[];
}

interface Ingrediente {
  calorias: number;
  nutrientes?: { nombre_nutriente: string; cantidad: number }[];
}

interface RecetaDetalle {
  ingredientes?: Ingrediente[];
}

const COMIDAS = ["Desayuno 1", "Desayuno 2", "Almuerzo", "Merienda", "Cena"];
const ID_DIETA = 1;

const Lunes: React.FC = () => {
  const navigate = useNavigate();
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [seleccion, setSeleccion] = useState<Record<string, SeleccionComida>>({});
  const [estadisticas, setEstadisticas] = useState<Estadisticas>({ calorias: 0, nutrientes: {} });

  useEffect(() => {
    const inicial: Record<string, SeleccionComida> = {};
    COMIDAS.forEach((c) => {
      inicial[c] = { alimentos: [], recetas: [] };
    });
    setSeleccion(inicial);
  }, []);

  useEffect(() => {
    fetch("/api/alimentos")
      .then((res) => res.json())
      .then((data: Alimento[]) => setAlimentos(data))
      .catch(console.error);

    fetch("/api/recetas")
      .then((res) => res.json())
      .then((data: Receta[]) => setRecetas(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    COMIDAS.forEach((comida) => {
      fetch(`/api/dieta-contenido/${ID_DIETA}/dia/Lunes/comida/${encodeURIComponent(comida)}`)
        .then((res) => res.json())
        .then((data: DietaContenido) => {
          setSeleccion((prev) => ({
            ...prev,
            [comida]: {
              alimentos: data.alimentos?.map((a) => ({
                id: a.id,
                nombre: a.nombre,
                cantidad: a.cantidad,
                tipo: "alimento",
              })) || [],
              recetas: data.recetas?.map((r) => ({
                id: r.id,
                nombre: r.nombre,
                cantidad: r.cantidad,
                tipo: "receta",
              })) || [],
            },
          }));
        })
        .catch((error) => console.error(`Error al cargar ${comida}:`, error));
    });
  }, []);

  useEffect(() => {
    const calcular = async () => {
      let totalCalorias = 0;
      const totalNutrientes: Record<string, number> = {};

      for (const comida of COMIDAS) {
        const sel = seleccion[comida];
        if (!sel) continue;

        for (const item of sel.alimentos) {
          try {
            const res = await fetch(`/api/alimentos/${item.id}`);
            if (!res.ok) continue;
            const data: AlimentoDetalle = await res.json();
            totalCalorias += data.calorias * item.cantidad;
            data.nutrientes?.forEach((n) => {
              totalNutrientes[n.nombre_nutriente] =
                (totalNutrientes[n.nombre_nutriente] || 0) + n.cantidad * item.cantidad;
            });
          } catch (err) {
            console.error("Error en alimento:", item, err);
          }
        }

        for (const receta of sel.recetas) {
          try {
            const res = await fetch(`/api/recetas/${receta.id}`);
            if (!res.ok) continue;
            const data: RecetaDetalle = await res.json();
            data.ingredientes?.forEach((ing) => {
              totalCalorias += ing.calorias * receta.cantidad;
              ing.nutrientes?.forEach((n) => {
                totalNutrientes[n.nombre_nutriente] =
                  (totalNutrientes[n.nombre_nutriente] || 0) + n.cantidad * receta.cantidad;
              });
            });
          } catch (err) {
            console.error("Error en receta:", receta, err);
          }
        }
      }

      setEstadisticas({ calorias: totalCalorias, nutrientes: totalNutrientes });
    };

    calcular();
  }, [seleccion]);

  const handleSeleccionar = (
    comida: string,
    tipo: SeleccionItemTipo,
    item: { id: number; nombre: string }
  ) => {
    setSeleccion((prev) => {
      const key = tipo === "alimento" ? "alimentos" : "recetas";
      const yaExiste = prev[comida]?.[key].some((el) => el.id === item.id);
      if (yaExiste) return prev;
      const nuevo: SeleccionItem = { ...item, cantidad: 1, tipo };
      return {
        ...prev,
        [comida]: {
          ...prev[comida],
          [key]: [...(prev[comida]?.[key] || []), nuevo],
        },
      };
    });
  };

  const handleEliminar = (comida: string, tipo: SeleccionItemTipo, id: number) => {
    const key = tipo === "alimento" ? "alimentos" : "recetas";
    setSeleccion((prev) => ({
      ...prev,
      [comida]: {
        ...prev[comida],
        [key]: prev[comida][key].filter((i) => i.id !== id),
      },
    }));
  };

  const handleCantidad = (
    comida: string,
    tipo: SeleccionItemTipo,
    id: number,
    nuevaCantidad: number
  ) => {
    const key = tipo === "alimento" ? "alimentos" : "recetas";
    setSeleccion((prev) => ({
      ...prev,
      [comida]: {
        ...prev[comida],
        [key]: prev[comida][key].map((i) =>
          i.id === id ? { ...i, cantidad: nuevaCantidad } : i
        ),
      },
    }));
  };

  const handleGuardar = async () => {
    try {
      for (const comida of COMIDAS) {
        const sel = seleccion[comida];
        if (!sel) continue;
        await fetch(`/api/dieta-contenido/${ID_DIETA}/dia/Lunes/comida/${encodeURIComponent(comida)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            alimentos: sel.alimentos.map(({ id, cantidad }) => ({ id_alimento: id, cantidad })),
            recetas: sel.recetas.map(({ id, cantidad }) => ({ id_receta: id, cantidad })),
          }),
        });
      }
      alert("Dieta del lunes guardada correctamente.");
      navigate("/edit-dieta/resumen");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la dieta del lunes.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dieta del Lunes</h1>

      <h3>Estadísticas Totales</h3>
      <p><strong>Calorías:</strong> {estadisticas.calorias.toFixed(2)} kcal</p>
      {Object.entries(estadisticas.nutrientes).map(([nombre, total]) => (
        <p key={nombre}><strong>{nombre}:</strong> {total.toFixed(2)}</p>
      ))}

      {COMIDAS.map((comida) => (
        <div key={comida} style={{ marginBottom: "2rem" }}>
          <h2>{comida}</h2>

          <select onChange={(e) => {
            const id = Number(e.target.value);
            const alimento = alimentos.find((a) => a.id_alimento === id);
            if (alimento) {
              handleSeleccionar(comida, "alimento", {
                id: alimento.id_alimento,
                nombre: alimento.nombre_alimento,
              });
            }
          }}>
            <option value="">-- Añadir alimento --</option>
            {alimentos.map((a) => (
              <option key={a.id_alimento} value={a.id_alimento}>
                {a.nombre_alimento}
              </option>
            ))}
          </select>

          <select onChange={(e) => {
            const id = Number(e.target.value);
            const receta = recetas.find((r) => r.id_receta === id);
            if (receta) {
              handleSeleccionar(comida, "receta", {
                id: receta.id_receta,
                nombre: receta.nombre,
              });
            }
          }}>
            <option value="">-- Añadir receta --</option>
            {recetas.map((r) => (
              <option key={r.id_receta} value={r.id_receta}>
                {r.nombre}
              </option>
            ))}
          </select>

          <ul>
            {[...(seleccion[comida]?.alimentos || []), ...(seleccion[comida]?.recetas || [])].map((item) => (
              <li key={`${item.tipo}-${item.id}`}>
                {item.nombre} -{" "}
                <input
                  type="number"
                  value={item.cantidad}
                  min={1}
                  onChange={(e) => handleCantidad(comida, item.tipo, item.id, Number(e.target.value))}
                />{" "}
                <button onClick={() => handleEliminar(comida, item.tipo, item.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button onClick={handleGuardar}>Guardar</button>
    </div>
  );
};

export default Lunes;
