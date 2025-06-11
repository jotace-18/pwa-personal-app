# Documentación del Esquema de Base de Datos

Este documento describe en detalle el **modelo relacional** utilizado por la PWA de planificación de comidas. Se incluyen todas las tablas, sus columnas, tipos de datos, restricciones y relaciones.

---

## Índice

1. [Usuarios (`users`)](#1-users)
2. [Unidades (`units`)](#2-units)
3. [Nutrientes (`nutrients`)](#3-nutrients)
4. [Ingredientes Genéricos (`foods`)](#4-foods)
5. [Supermercados (`stores`)](#5-stores)
6. [Productos (`products`)](#6-products)
7. [Perfil Nutricional de Productos (`product_nutrients`)](#7-product_nutrients)
8. [Recetas (`recipes`)](#8-recipes)
9. [Ingredientes de Recetas (`recipe_ingredients`)](#9-recipe_ingredients)
10. [Tipos de Comida (`meal_types`)](#10-meal_types)
11. [Planes Semanales (`plans`)](#11-plans)
12. [Entradas de Plan (`plan_entries`)](#12-plan_entries)

---

### Convenciones

* **PK**: Clave primaria
* **FK**: Clave foránea
* **NN**: NOT NULL
* **UQ**: UNIQUE
* Las columnas `created_at` y `updated_at` utilizan `TIMESTAMP DEFAULT now()` para auditoría.

---

## 1. `users`

* **Propósito**: Gestión de usuarios de la aplicación.

| Columna      | Tipo           | Restricciones       | Descripción                    |
| ------------ | -------------- | ------------------- | ------------------------------ |
| `id`         | `SERIAL`       | PK                  | Identificador único de usuario |
| `username`   | `VARCHAR(50)`  | NN, UQ              | Nombre de usuario              |
| `email`      | `VARCHAR(100)` | NN, UQ              | Correo electrónico             |
| `created_at` | `TIMESTAMP`    | NN, DEFAULT `now()` | Fecha de creación              |

---

## 2. `units`

* **Propósito**: Normalizar unidades de medida y conversión a unidad base.

| Columna          | Tipo            | Restricciones | Descripción                                            |
| ---------------- | --------------- | ------------- | ------------------------------------------------------ |
| `id`             | `SERIAL`        | PK            | Identificador de unidad                                |
| `name`           | `VARCHAR(30)`   | NN            | Nombre de la unidad ("gramo", "mililitro", "ud")       |
| `abbreviation`   | `VARCHAR(10)`   | NN            | Abreviatura ("g", "ml", "ud")                          |
| `to_base_factor` | `NUMERIC(10,6)` | NN            | Factor de conversión a unidad base (p.ej. kg→g = 1000) |

---

## 3. `nutrients`

* **Propósito**: Catálogo de macro-nutrientes trackeados.

| Columna | Tipo          | Restricciones | Descripción                               |
| ------- | ------------- | ------------- | ----------------------------------------- |
| `id`    | `SERIAL`      | PK            | Identificador de nutriente                |
| `name`  | `VARCHAR(50)` | NN, UQ        | Nombre ("Grasas totales", "Proteínas", …) |

---

## 4. `foods`

* **Propósito**: Ingredientes genéricos sin marca ni valores nutricionales.

| Columna      | Tipo           | Restricciones       | Descripción                   |
| ------------ | -------------- | ------------------- | ----------------------------- |
| `id`         | `SERIAL`       | PK                  | Identificador de ingrediente  |
| `name`       | `VARCHAR(100)` | NN                  | Nombre ("Tomate frito", ...)  |
| `category`   | `VARCHAR(30)`  | NN                  | Categoría ("Pan", "Carne", …) |
| `created_at` | `TIMESTAMP`    | NN, DEFAULT `now()` | Fecha de creación             |
| `updated_at` | `TIMESTAMP`    | NN, DEFAULT `now()` | Fecha de última actualización |

---

## 5. `stores`

* **Propósito**: Catálogo de puntos de venta (supermercados, tiendas locales).

| Columna      | Tipo           | Restricciones       | Descripción             |
| ------------ | -------------- | ------------------- | ----------------------- |
| `id`         | `SERIAL`       | PK                  | Identificador de tienda |
| `name`       | `VARCHAR(100)` | NN                  | Nombre de la tienda     |
| `created_at` | `TIMESTAMP`    | NN, DEFAULT `now()` | Fecha de creación       |

---

## 6. `products`

* **Propósito**: SKU concreto que vincula ingrediente genérico + tienda + marca, con precio y calorías.

| Columna             | Tipo           | Restricciones         | Descripción                     |
| ------------------- | -------------- | --------------------- | ------------------------------- |
| `product_id`        | `SERIAL`       | PK                    | Identificador único de producto |
| `food_id`           | `INT`          | NN, FK → `foods(id)`  | Ingrediente genérico base       |
| `store_id`          | `INT`          | NN, FK → `stores(id)` | Punto de venta                  |
| `brand`             | `VARCHAR(50)`  | NN                    | Marca del producto              |
| `price_per_100g`    | `NUMERIC(8,2)` | NN                    | Precio en €/100g                |
| `calories_per_100g` | `NUMERIC(6,2)` | NN                    | Energía en kcal/100g            |
| `created_at`        | `TIMESTAMP`    | NN, DEFAULT `now()`   | Fecha de inserción              |
| `updated_at`        | `TIMESTAMP`    | NN, DEFAULT `now()`   | Fecha de actualización          |

**Restricciones adicionales**:

* `UNIQUE (food_id, store_id, brand)` para evitar duplicados de SKU.

---

## 7. `product_nutrients`

* **Propósito**: Perfil nutricional de cada SKU (productos).

| Columna       | Tipo           | Restricciones                   | Descripción                                          |
| ------------- | -------------- | ------------------------------- | ---------------------------------------------------- |
| `product_id`  | `INT`          | NN, FK → `products(product_id)` | Producto concreto                                    |
| `nutrient_id` | `INT`          | NN, FK → `nutrients(id)`        | Tipo de nutriente                                    |
| `amount_100g` | `NUMERIC(8,4)` | NN                              | Cantidad de nutriente por 100g de producto (en g/mg) |

**PK**: `(product_id, nutrient_id)`

---

## 8. `recipes`

* **Propósito**: Recetas o platos compuestos creados por usuarios.

| Columna      | Tipo           | Restricciones       | Descripción                                               |
| ------------ | -------------- | ------------------- | --------------------------------------------------------- |
| `id`         | `SERIAL`       | PK                  | Identificador de receta                                   |
| `user_id`    | `INT`          | FK → `users(id)`    | Autor de la receta (puede ser NULL para recetas globales) |
| `name`       | `VARCHAR(100)` | NN                  | Nombre de la receta                                       |
| `created_at` | `TIMESTAMP`    | NN, DEFAULT `now()` | Fecha de creación                                         |

---

## 9. `recipe_ingredients`

* **Propósito**: Desglosa cada receta en productos concretos con cantidades y unidades.

| Columna      | Tipo           | Restricciones                   | Descripción                     |
| ------------ | -------------- | ------------------------------- | ------------------------------- |
| `recipe_id`  | `INT`          | NN, FK → `recipes(id)`          | Receta                          |
| `product_id` | `INT`          | NN, FK → `products(product_id)` | Producto concreto               |
| `quantity`   | `NUMERIC(8,2)` | NN                              | Cantidad (p.ej. 150 para 150 g) |
| `unit_id`    | `INT`          | NN, FK → `units(id)`            | Unidad de medida                |

**PK**: `(recipe_id, product_id)`

---

## 10. `meal_types`

* **Propósito**: Normalizar los tipos de comida dentro de un día.

| Columna | Tipo          | Restricciones | Descripción                    |
| ------- | ------------- | ------------- | ------------------------------ |
| `id`    | `SERIAL`      | PK            | Identificador de tipo          |
| `name`  | `VARCHAR(30)` | NN            | Nombre ("desayuno", "cena", …) |

---

## 11. `plans`

* **Propósito**: Agrupar una serie de comidas planificadas en un rango de fechas (dieta semanal).

| Columna      | Tipo          | Restricciones        | Descripción                              |
| ------------ | ------------- | -------------------- | ---------------------------------------- |
| `id`         | `SERIAL`      | PK                   | Identificador de plan                    |
| `user_id`    | `INT`         | NN, FK → `users(id)` | Usuario dueño del plan                   |
| `name`       | `VARCHAR(50)` | NN                   | Nombre del plan (p.ej. "Semana 24-2025") |
| `start_date` | `DATE`        | NN                   | Fecha de inicio                          |
| `end_date`   | `DATE`        | NN                   | Fecha de fin                             |

---

## 12. `plan_entries`

* **Propósito**: Detallar cada comida dentro de un plan, ya sea receta o producto suelto.

| Columna        | Tipo           | Restricciones               | Descripción                           |
| -------------- | -------------- | --------------------------- | ------------------------------------- |
| `id`           | `SERIAL`       | PK                          | Identificador de entrada              |
| `plan_id`      | `INT`          | NN, FK → `plans(id)`        | Plan al que pertenece                 |
| `date`         | `DATE`         | NN                          | Fecha de la comida                    |
| `meal_type_id` | `INT`          | NN, FK → `meal_types(id)`   | Tipo de comida (desayuno, cena, etc.) |
| `recipe_id`    | `INT`          | FK → `recipes(id)`          | Referencia a receta (si aplica)       |
| `product_id`   | `INT`          | FK → `products(product_id)` | Referencia a producto (si aplica)     |
| `quantity`     | `NUMERIC(8,2)` | NN                          | Cantidad en unidades o gramos         |
| `unit_id`      | `INT`          | NN, FK → `units(id)`        | Unidad de medida                      |

**Restricción CHECK**: `CHECK ((recipe_id IS NULL) <> (product_id IS NULL))` obliga a elegir receta **o** producto, nunca ambos ni ninguno.

---

## Relaciones Principales

* `recipes.user_id` → `users.id`
* `recipe_ingredients.product_id` → `products.product_id`
* `products.food_id` → `foods.id`
* `product_nutrients.product_id` → `products.product_id`
* `plan_entries.plan_id` → `plans.id`
* `plan_entries.recipe_id` → `recipes.id`
* `plan_entries.product_id` → `products.product_id`
* `plan_entries.meal_type_id` → `meal_types.id`
* `plans.user_id` → `users.id`
* `units` y `nutrients` son referenciadas por múltiples tablas para estandarizar medidas y tipos.

---

