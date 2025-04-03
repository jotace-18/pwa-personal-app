import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "../../styles/pages_styles/AlimentosList.module.css";

interface Nutriente {
  nombre_nutriente: string;
  cantidad: number;
}

interface Alimento {
  id_alimento: number;
  nombre_alimento: string;
  tipo: string;
  supermercado: string;
  marca: string;
  precio: number;
  calorias: number;
  nutrientes?: Nutriente[];
}

const AlimentosList = () => {
  const [showAlimentos, setShowAlimentos] = useState(false);
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [detallesAlimentos, setDetallesAlimentos] = useState<Record<number, Alimento>>({});
  const [editingAlimento, setEditingAlimento] = useState<Alimento | null>(null);
  const navigate = useNavigate();

  const handleMostrar = async () => {
    try {
      const response = await axios.get<Alimento[]>("http://localhost:4000/api/alimentos");
      setAlimentos(response.data);
      setShowAlimentos(true);
    } catch (error) {
      console.error("Error al obtener alimentos:", error);
    }
  };

  const handleOcultar = () => {
    setShowAlimentos(false);
  };

  // Función que alterna el despliegue y, al expandir, obtiene el detalle si aún no se tiene
  const toggleItemDetails = (alimento: Alimento) => {
    if (expandedItems.includes(alimento.id_alimento)) {
      setExpandedItems(expandedItems.filter((id) => id !== alimento.id_alimento));
    } else {
      // Al expandir, si no se tienen los detalles, se hace la petición
      if (!detallesAlimentos[alimento.id_alimento]) {
        axios
          .get<Alimento>(`http://localhost:4000/api/alimentos/${alimento.nombre_alimento}`)
          .then((response) => {
            const detalle = response.data;
            setDetallesAlimentos((prev) => ({
              ...prev,
              [alimento.id_alimento]: {
                ...detalle,
                nutrientes: detalle.nutrientes || [],
              },
            }));
          })
          .catch((error) => {
            console.error("Error al obtener detalle del alimento:", error);
          });
      }
      setExpandedItems([...expandedItems, alimento.id_alimento]);
    }
  };

  const handleEditar = async (alimento: Alimento) => {
    try {
      const response = await axios.get<Alimento>(
        `http://localhost:4000/api/alimentos/${alimento.nombre_alimento}`
      );
      const detalle = response.data;
      setEditingAlimento({
        ...detalle,
        nutrientes: detalle.nutrientes || [],
      });
    } catch (error) {
      console.error("Error al obtener detalle del alimento:", error);
    }
  };

  const handleCancelarEdicion = () => {
    setEditingAlimento(null);
  };

  const handleGuardar = async () => {
    console.log("Guardar cambios:", editingAlimento);
    setEditingAlimento(null);
  };

  const handleChange = (field: keyof Alimento, value: string | number) => {
    if (editingAlimento) {
      setEditingAlimento({ ...editingAlimento, [field]: value });
    }
  };

  const handleNutrienteChange = (index: number, value: number) => {
    if (editingAlimento && editingAlimento.nutrientes) {
      const updatedNutrientes = [...editingAlimento.nutrientes];
      updatedNutrientes[index].cantidad = value;
      setEditingAlimento({ ...editingAlimento, nutrientes: updatedNutrientes });
    }
  };

  const handleAñadir = () => {
    navigate("/alimentos");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {!showAlimentos ? (
          <button className={styles.showButton} onClick={handleMostrar}>
            Mostrar Alimentos
          </button>
        ) : (
          <button className={styles.hideButton} onClick={handleOcultar}>
            Ocultar Alimentos
          </button>
        )}
        <button className={styles.addButton} onClick={handleAñadir}>
          Añadir Alimento
        </button>
      </div>

      {showAlimentos && (
        <ul className={styles.list}>
          {alimentos.map((alimento) => (
            <li key={alimento.id_alimento} className={styles.listItem}>
              <div className={styles.itemHeader}>
                <span className={styles.itemTitle}>{alimento.nombre_alimento}</span>
                <div className={styles.actions}>
                  <button
                    className={styles.toggleButton}
                    onClick={() => toggleItemDetails(alimento)}
                  >
                    {expandedItems.includes(alimento.id_alimento) ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  <button className={styles.editButton} onClick={() => handleEditar(alimento)}>
                    <FaEdit />
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() =>
                      console.log(`Eliminar alimento: ${alimento.id_alimento}`)
                    }
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {expandedItems.includes(alimento.id_alimento) && (
                <div className={styles.details}>
                  {detallesAlimentos[alimento.id_alimento] ? (
                    <>
                      <p>
                        <strong>Tipo:</strong> {detallesAlimentos[alimento.id_alimento].tipo}
                      </p>
                      <p>
                        <strong>Supermercado:</strong> {detallesAlimentos[alimento.id_alimento].supermercado}
                      </p>
                      <p>
                        <strong>Marca:</strong> {detallesAlimentos[alimento.id_alimento].marca}
                      </p>
                      <p>
                        <strong>Precio:</strong> €{detallesAlimentos[alimento.id_alimento].precio}
                      </p>
                      <p>
                        <strong>Calorías:</strong> {detallesAlimentos[alimento.id_alimento].calorias}
                      </p>
                      {detallesAlimentos[alimento.id_alimento].nutrientes &&
                        detallesAlimentos[alimento.id_alimento].nutrientes!.length > 0 && (
                          <>
                            <h4>Nutrientes</h4>
                            <ul className={styles.nutrientList}>
                              {detallesAlimentos[alimento.id_alimento].nutrientes!.map((nut, idx) => (
                                <li key={idx} className={styles.nutrientItem}>
                                  {nut.nombre_nutriente}: {nut.cantidad} g
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                    </>
                  ) : (
                    <p>Cargando detalles...</p>
                  )}
                </div>
              )}

              {editingAlimento?.id_alimento === alimento.id_alimento && (
                <form className={styles.editForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nombre:</label>
                    <input
                      type="text"
                      value={editingAlimento.nombre_alimento}
                      onChange={(e) =>
                        handleChange("nombre_alimento", e.target.value)
                      }
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Tipo:</label>
                    <input
                      type="text"
                      value={editingAlimento.tipo}
                      onChange={(e) => handleChange("tipo", e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Supermercado:</label>
                    <input
                      type="text"
                      value={editingAlimento.supermercado}
                      onChange={(e) => handleChange("supermercado", e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Marca:</label>
                    <input
                      type="text"
                      value={editingAlimento.marca}
                      onChange={(e) => handleChange("marca", e.target.value)}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Precio:</label>
                    <input
                      type="number"
                      value={editingAlimento.precio}
                      onChange={(e) => handleChange("precio", parseFloat(e.target.value))}
                      className={styles.formInput}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Calorías:</label>
                    <input
                      type="number"
                      value={editingAlimento.calorias}
                      onChange={(e) => handleChange("calorias", parseFloat(e.target.value))}
                      className={styles.formInput}
                    />
                  </div>
                  <h4 className={styles.nutrientTitle}>Nutrientes</h4>
                  {editingAlimento.nutrientes?.map((nutriente, index) => (
                    <div key={index} className={styles.formGroup}>
                      <label className={styles.formLabel}>{nutriente.nombre_nutriente}:</label>
                      <input
                        type="number"
                        value={nutriente.cantidad}
                        onChange={(e) =>
                          handleNutrienteChange(index, parseFloat(e.target.value))
                        }
                        className={styles.formInput}
                      />
                    </div>
                  ))}
                  <div className={styles.formActions}>
                    <button type="button" className={styles.saveButton} onClick={handleGuardar}>
                      Guardar
                    </button>
                    <button type="button" className={styles.cancelButton} onClick={handleCancelarEdicion}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlimentosList;
