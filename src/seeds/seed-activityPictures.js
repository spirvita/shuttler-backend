module.exports = async (dataSource) => {
  const activityPicturesRepo = dataSource.getRepository('ActivityPictures');
  const activitiesRepo = dataSource.getRepository('Activities');

  const activities = await activitiesRepo.find();
  if (!activities || activities.length === 0) {
    throw new Error('✘ Activities 資料尚未建立，請先執行 seed-activities.js');
  }

  const defaultActivityPictures = [
    {
      activity_id: activities[0].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[0].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[0].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[0].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[0].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[1].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[1].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[2].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[3].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[4].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[4].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[4].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[5].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[6].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[6].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[7].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[7].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[7].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[7].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[8].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[9].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      activity_id: activities[9].id,
      url: 'https://images.unsplash.com/photo-1617696618050-b0fef0c666af?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ];

  for (const activityPicture of defaultActivityPictures) {
    await activityPicturesRepo.save(activityPicture);
  }
};
