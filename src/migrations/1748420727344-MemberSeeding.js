/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
const bcrypt = require('bcrypt');

module.exports = class MemberSeeding1748420727344 {
  constructor() {
    this.name = 'MemberSeeding1748420727344';
  }

  async seedMembers(queryRunner) {
    const saltRounds = 10;
    const membersRepo = queryRunner.manager.getRepository('Members');
    const levelsRepo = queryRunner.manager.getRepository('Levels');

    // 驗證依賴資料存在
    const levels = await levelsRepo.find({ where: [{ level: 1 }, { level: 2 }] });

    const level1 = levels.find((l) => l.level === 1);
    const level2 = levels.find((l) => l.level === 2);

    const [password1Hash, password2Hash] = await Promise.all([
      bcrypt.hash('Aa12345678', saltRounds),
      bcrypt.hash('Bb12345678', saltRounds),
    ]);

    const defaultMembers = [
      {
        name: '使用者1',
        email: 'example1@example.com',
        password: password1Hash,
        photo:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        level_id: level1.id,
        points: 0,
      },
      {
        name: '使用者2',
        email: 'example2@example.com',
        password: password2Hash,
        photo:
          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        level_id: level2.id,
        points: 500,
      },
    ];

    await membersRepo.save(defaultMembers);
    console.log(`✓ Insert ${defaultMembers.length} members`);
  }

  async up(queryRunner) {
    await queryRunner.startTransaction();

    try {
      await this.seedMembers(queryRunner);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async down(queryRunner) {
    const emails = ['example1@example.com', 'example2@example.com'];

    // 批量刪除
    await queryRunner.query('DELETE FROM MEMBERS WHERE email = ANY($1)', [emails]);
  }
};
