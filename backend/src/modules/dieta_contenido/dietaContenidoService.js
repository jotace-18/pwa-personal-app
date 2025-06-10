import { DietaAlimento, DietaReceta } from './dietaContenidoModel.js';
import Alimento from '../alimentos/alimentosModel.js';
import Receta from '../receta/recetaModel.js';

export const getComidaDelDia = async (idDieta, dia, comida) => {
  const alimentos = await DietaAlimento.findAll({
    where: { id_dieta: idDieta, dia, comida },
    include: [{ model: Alimento, attributes: ['nombre_alimento'] }],
  });

  const recetas = await DietaReceta.findAll({
    where: { id_dieta: idDieta, dia, comida },
    include: [{ model: Receta, attributes: ['nombre'] }],
  });

  return {
    alimentos: alimentos.map(a => ({
      id: a.id_alimento,
      nombre: a.Alimento?.nombre_alimento || 'Alimento',
      cantidad: Number(a.cantidad),
    })),
    recetas: recetas.map(r => ({
      id: r.id_receta,
      nombre: r.Receta?.nombre || 'Receta',
      cantidad: Number(r.cantidad),
    })),
  };
};

export const saveComidaDelDia = async (idDieta, dia, comida, alimentos, recetas) => {
  const t = await DietaAlimento.sequelize.transaction();

  try {
    await DietaAlimento.destroy({ where: { id_dieta: idDieta, dia, comida }, transaction: t });
    await DietaReceta.destroy({ where: { id_dieta: idDieta, dia, comida }, transaction: t });

    for (const { id_alimento, cantidad } of alimentos) {
      await DietaAlimento.create(
        { id_dieta: idDieta, id_alimento, dia, comida, cantidad },
        { transaction: t }
      );
    }

    for (const { id_receta, cantidad } of recetas) {
      await DietaReceta.create(
        { id_dieta: idDieta, id_receta, dia, comida, cantidad },
        { transaction: t }
      );
    }

    await t.commit();
  } catch (err) {
    await t.rollback();
    throw err;
  }
};
