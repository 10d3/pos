/*
  Warnings:

  - Changed the type of `category` on the `MenuItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('Entrées', 'Plats Principaux', 'Pizzas', 'Burgers', 'Salades', 'Pâtes', 'Grillades', 'Fruits de Mer', 'Soupes', 'Sandwiches', 'Accompagnements', 'Vegan', 'Desserts', 'Boissons', 'Vins & Alcools', 'Menu Enfant', 'Petit Déjeuner', 'Spécialités');

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "category",
ADD COLUMN     "category" "CategoryType" NOT NULL;
