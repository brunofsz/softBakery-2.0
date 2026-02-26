-- DropForeignKey
ALTER TABLE "Venda" DROP CONSTRAINT "Venda_clienteId_fkey";

-- AlterTable
ALTER TABLE "Venda" ALTER COLUMN "clienteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
