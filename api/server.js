const fastify = require('fastify')({ logger: true });

const { PrismaClient } = require('@prisma/client');
const prismaClient = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

fastify.register(require('@fastify/cors'), { 
    origin: true
});

fastify.get('/agendas', async (request, reply) => {
    const agendas = await prismaClient.agenda.findMany();
    reply.send(agendas);
});

fastify.get('/agendas/:id', async (request, reply) => {
    const { id } = request.params;
    const agenda = await prismaClient.agenda.findUnique({
        where: { id: parseInt(id) }
    });
    reply.send(agenda);
});

fastify.post('/agendas', async (request, reply) => {
    const { nome, telefone, endereco, email } = request.body;
    const newAgenda = await prismaClient.agenda.create({
        data: { nome, telefone, endereco, email }
    });
    reply.send(newAgenda);
});

fastify.put('/agendas/:id', async (request, reply) => {
    const { id } = request.params;
    const { nome, telefone, endereco, email } = request.body;
    const updatedAgenda = await prismaClient.agenda.update({
        where: { id: parseInt(id) },
        data: { nome, telefone, endereco, email }
    });
    reply.send(updatedAgenda);
});

fastify.delete('/agendas/:id', async (request, reply) => {
    const { id } = request.params;
    const deletedAgenda = await prismaClient.agenda.delete({
        where: { id: parseInt(id) }
    });
    reply.send(deletedAgenda);
});

const start = async () => {
    try {
        await fastify.listen({ port: 3001 });
        fastify.log.info(`Server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();