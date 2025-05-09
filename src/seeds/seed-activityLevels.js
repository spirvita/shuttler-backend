module.exports = async (dataSource) => {
  const activityLevelsRepo = dataSource.getRepository('ActivityLevels');
  const activitiesRepo = dataSource.getRepository('Activities');
  const levelsRepo = dataSource.getRepository('Levels');

  const levels = await levelsRepo.find();
  if (!levels || levels.length === 0) {
    throw new Error('✘ Level 資料尚未建立，請先執行 seed-levels.js');
  }

  const activities = await activitiesRepo.find();
  if (!activities || activities.length === 0) {
    throw new Error('✘ Activities 資料尚未建立，請先執行 seed-activities.js');
  }
  const defaultActivityLevels = [
    {
      activity_id: activities[0].id,
      level_id: levels[0].id,
    },
    {
      activity_id: activities[0].id,
      level_id: levels[3].id,
    },
    {
      activity_id: activities[1].id,
      level_id: levels[2].id,
    },
    {
      activity_id: activities[2].id,
      level_id: levels[4].id,
    },
    {
      activity_id: activities[2].id,
      level_id: levels[5].id,
    },
    {
      activity_id: activities[3].id,
      level_id: levels[0].id,
    },
    {
      activity_id: activities[4].id,
      level_id: levels[2].id,
    },
    {
      activity_id: activities[5].id,
      level_id: levels[0].id,
    },
    {
      activity_id: activities[6].id,
      level_id: levels[0].id,
    },
    {
      activity_id: activities[7].id,
      level_id: levels[0].id,
    },
    {
      activity_id: activities[7].id,
      level_id: levels[1].id,
    },
    {
      activity_id: activities[8].id,
      level_id: levels[1].id,
    },
    {
      activity_id: activities[8].id,
      level_id: levels[2].id,
    },
    {
      activity_id: activities[9].id,
      level_id: levels[2].id,
    },
    {
      activity_id: activities[9].id,
      level_id: levels[3].id,
    },
  ];
  for (const activityLevel of defaultActivityLevels) {
    const exists = await activityLevelsRepo.findOneBy({
      activity_id: activityLevel.activity_id,
      level_id: activityLevel.level_id,
    });
    if (!exists) {
      await activityLevelsRepo.save(activityLevel);
    }
  }
};
