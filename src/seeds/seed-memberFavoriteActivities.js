module.exports = async (dataSource) => {
  const memberFavoriteActivitiesRepo = dataSource.getRepository('MemberFavoriteActivities');
  const membersRepo = dataSource.getRepository('Members');
  const activitiesRepo = dataSource.getRepository('Activities');

  const members = await membersRepo.find();
  if (!members || members.length === 0) {
    throw new Error('✘ Members 資料尚未建立，請先執行 seed-members.js');
  }

  const activities = await activitiesRepo.find();
  if (!activities || activities.length === 0) {
    throw new Error('✘ Activities 資料尚未建立，請先執行 seed-activities.js');
  }
  const defaultMemberFavoriteActivities = [
    {
      member_id: members[0].id,
      activity_id: activities[0].id,
    },
    {
      member_id: members[0].id,
      activity_id: activities[1].id,
    },
    {
      member_id: members[0].id,
      activity_id: activities[2].id,
    },
    {
      member_id: members[0].id,
      activity_id: activities[6].id,
    },
    {
      member_id: members[1].id,
      activity_id: activities[4].id,
    },
    {
      member_id: members[1].id,
      activity_id: activities[8].id,
    },
  ];
  for (const memberFavoriteActivity of defaultMemberFavoriteActivities) {
    const exists = await memberFavoriteActivitiesRepo.findOneBy({
      member_id: memberFavoriteActivity.member_id,
      activity_id: memberFavoriteActivity.activity_id,
    });
    if (!exists) {
      await memberFavoriteActivitiesRepo.save(memberFavoriteActivity);
    }
  }
};
