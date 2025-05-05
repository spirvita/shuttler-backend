const path = require('path');
const { dataSource } = require('../db/data-source');
const logger = require('../utils/logger')('seed');

const runAllSeeds = async () => {
  await dataSource.initialize();
  
  // 因假資料有建立先後順序，所以不用fs的方式掃描seeds資料夾，改為手動排序
  const seedFilesInOrder = [
    'seed-cities.js',
    'seed-levels.js',
    'seed-facilities.js',
    'seed-members.js',
    'seed-activities.js',
    'seed-activityLevels.js',
    'seed-activityFacilities.js',
    'seed-activityPictures.js',
  ];

  for (const file of seedFilesInOrder) {
    const seedDir = __dirname;
    const seedPath = path.join(seedDir, file);
    const seedFn = require(seedPath);
    
    logger.info(`Running seed file: ${file}...`);
    await seedFn(dataSource);
    logger.info(`✔ ${file} completed.`);
  }

  logger.info('All seed files executed successfully.');
  process.exit();
};

runAllSeeds().catch((err) => {
  logger.error('✘ Seeding failed with error:', err);
  process.exit(1);
});
