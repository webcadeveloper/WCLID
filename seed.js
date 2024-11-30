const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  // Usuarios a insertar
  const usuarios = [
    { username: 'hnq', password: '6173612', role: 'SUPERVISOR', firstName: 'Hnq', lastName: 'Supervisor', email: 'hnq@supervisor.com' },
    { username: 'hna', password: '18185551', role: 'SUPERVISOR', firstName: 'Hna', lastName: 'Supervisor', email: 'hna@supervisor.com' },
    { username: 'operador1', password: '7867100087', role: 'OPERATOR', firstName: 'Operador', lastName: 'Uno', email: 'operador1@operator.com' },
    { username: 'operador2', password: '6618687', role: 'OPERATOR', firstName: 'Operador', lastName: 'Dos', email: 'operador2@operator.com' },
  ];

  for (const user of usuarios) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        username: user.username,
        passwordHash: hashedPassword,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
    console.log(`Usuario ${user.username} insertado correctamente.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
