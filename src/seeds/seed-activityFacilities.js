module.exports = async (dataSource) => {
  const activityFacilitiesRepo = dataSource.getRepository('ActivityFacilities');
  const activitiesRepo = dataSource.getRepository('Activities');
  const facilitiesRepo = dataSource.getRepository('Facilities');
  
  const facilities = await facilitiesRepo.find();
  if (!facilities || facilities.length === 0) {
    throw new Error('✘ Facilities 資料尚未建立，請先執行 seed-facilities.js');
  }

  const activities = await activitiesRepo.find();
  if (!activities || activities.length === 0) {
    throw new Error('✘ Activities 資料尚未建立，請先執行 seed-activities.js');
  }
  const defaultActivityFacilities = [
    {
      activity_id: activities[0].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[0].id,
      facility_id: facilities[4].id,
    },
    {
      activity_id: activities[0].id,
      facility_id: facilities[7].id,
    },
    {
      activity_id: activities[1].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[1].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[1].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[1].id,
      facility_id: facilities[7].id,
    },
    {
      activity_id: activities[2].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[2].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[2].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[2].id,
      facility_id: facilities[7].id,
    },
    {
      activity_id: activities[3].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[3].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[3].id,
      facility_id: facilities[7].id,
    },
    {
      activity_id: activities[4].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[4].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[4].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[4].id,
      facility_id: facilities[5].id,
    },
    {
      activity_id: activities[5].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[5].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[5].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[5].id,
      facility_id: facilities[7].id,
    },
    {
      activity_id: activities[6].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[6].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[6].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[6].id,
      facility_id: facilities[3].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[4].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[5].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[6].id,
    },
    {
      activity_id: activities[7].id,
      facility_id: facilities[7].id,
    },
    {
      activity_id: activities[8].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[8].id,
      facility_id: facilities[2].id,
    },
    {
      activity_id: activities[9].id,
      facility_id: facilities[0].id,
    },
    {
      activity_id: activities[9].id,
      facility_id: facilities[1].id,
    },
    {
      activity_id: activities[9].id,
      facility_id: facilities[2].id,
    }
  ];
  for (const activityFacility of defaultActivityFacilities) {
    const exists = await activityFacilitiesRepo.findOneBy({
      activity_id: activityFacility.activity_id,
      facility_id: activityFacility.facility_id,
    });
    if (!exists) {
      await activityFacilitiesRepo.save(activityFacility);
    }
  }
}