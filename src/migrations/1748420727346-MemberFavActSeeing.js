/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
module.exports = class MemberFavActSeeing1748420727346 {
  constructor() {
    this.name = 'MemberFavActSeeing1748420727346';
  }

  async seedMemberFavActs(queryRunner) {
    const memberFavActRepo = queryRunner.manager.getRepository('MemberFavoriteActivities');
    const membersRepo = queryRunner.manager.getRepository('Members');
    const activitiesRepo = queryRunner.manager.getRepository('Activities');

    const [members, activities] = await Promise.all([membersRepo.find(), activitiesRepo.find()]);

    const defaultMemberFavActs = [
      { member_id: members[0].id, activity_id: activities[0].id },
      { member_id: members[0].id, activity_id: activities[1].id },
      { member_id: members[0].id, activity_id: activities[2].id },
      { member_id: members[0].id, activity_id: activities[6].id },
      { member_id: members[1].id, activity_id: activities[4].id },
      { member_id: members[1].id, activity_id: activities[8].id },
    ];

    const saveFavorites = await memberFavActRepo.save(defaultMemberFavActs);
    console.log(`✓ 已插入 ${saveFavorites.length} 筆收藏關聯`);

    // 記錄統計資訊
    const totalFavorites = await memberFavActRepo.count();
    console.log(`📊 目前總收藏數: ${totalFavorites} 筆`);
  }

  async up(queryRunner) {
    await queryRunner.startTransaction();

    try {
      await this.seedMemberFavActs(queryRunner);
      await queryRunner.commitTransaction();
      console.log('✓ MemberFavActSeeding migration successfully');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('✘ MemberFavActSeeding migration failed:', error.message);
      throw error;
    }
  }

  async down(queryRunner) {
    await queryRunner.query(`DELETE FROM MEMBER_FAVORITE_ACTIVITIES`);
  }
};
