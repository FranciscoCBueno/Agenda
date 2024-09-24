-- CreateTable
CREATE TABLE "agenda" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "endereco" TEXT,
    "email" TEXT,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);
