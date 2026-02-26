/*
  Warnings:

  - Changed the type of `formaPagamento` on the `Pagamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipoPagamento` on the `Venda` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Venda` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TipoPagamento" AS ENUM ('AVISTA', 'CREDITO', 'FIADO');

-- CreateEnum
CREATE TYPE "StatusVenda" AS ENUM ('PAGO', 'PENDENTE');

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "formaPagamento",
ADD COLUMN     "formaPagamento" "TipoPagamento" NOT NULL;

-- AlterTable
ALTER TABLE "Venda" DROP COLUMN "tipoPagamento",
ADD COLUMN     "tipoPagamento" "TipoPagamento" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "StatusVenda" NOT NULL;
