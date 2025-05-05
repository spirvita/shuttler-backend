module.exports = async (dataSource) => {
  const levelsRepo = dataSource.getRepository('Levels');

  const defaultLevels = [
    { level: 1, name: '新手階' },
    { level: 2, name: '初階' },
    { level: 3, name: '初中階' },
    { level: 4, name: '中階' },
    { level: 5, name: '中進階' },
    { level: 6, name: '高階' },
    { level: 7, name: '職業級' },
  ];

  for (const level of defaultLevels) {
    const exists = await levelsRepo.findOneBy({ level: level.level });
    if (!exists) {
      await levelsRepo.save(level);
    }
  }
};
