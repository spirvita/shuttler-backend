const bcrypt = require('bcrypt');

module.exports = async (dataSource) => {
  const membersRepo = dataSource.getRepository('Members');
  const levelsRepo = dataSource.getRepository('Levels');

  const level1 = await levelsRepo.findOneBy({ level: 1 });
  const level2 = await levelsRepo.findOneBy({ level: 2 });

  if (!level1 || !level2) {
    throw new Error('✘ Level 資料尚未建立，請先執行 seed-levels.js');
  }

  const saltRounds = 10;

  const defaultMembers = [
    {
      name: '使用者1',
      email: 'example1@example.com',
      password: await bcrypt.hash('Aa12345678', saltRounds),
      photo:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      level_id: level1.id,
    },
    {
      name: '使用者2',
      email: 'example2@example.com',
      password: await bcrypt.hash('Bb12345678', saltRounds),
      photo:
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      level_id: level2.id,
    },
  ];

  for (const member of defaultMembers) {
    const exists = await membersRepo.findOneBy({ email: member.email });
    if (!exists) {
      await membersRepo.save(member);
    }
  }
};
