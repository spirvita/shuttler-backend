module.exports = async (dataSource) => {
  const pointsPlanRepo = dataSource.getRepository('PointsPlan');

  const defaultPlan = [
    {
      points: 100,
      value: 100,
    },
    {
      points: 300,
      value: 300,
    },
    {
      points: 500,
      value: 500,
    },
  ];

  for (const plan of defaultPlan) {
    const exists = await pointsPlanRepo.findOneBy({ points: plan.points, value: plan.value });

    if (!exists) {
      await pointsPlanRepo.save(plan);
    }
  }
};
