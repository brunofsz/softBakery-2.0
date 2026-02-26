/*
  Warnings:

  - Changed the type of `tipo` on the `MovimentacaoEstoque` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoMovEstoque" AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');

-- AlterTable
ALTER TABLE "MovimentacaoEstoque" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "TipoMovEstoque" NOT NULL;
