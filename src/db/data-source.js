const { DataSource } = require('typeorm');
const config = require('../config/index');

const Members = require('../entities/Members');
const Activities = require('../entities/Activities');
const ActivityPictures = require('../entities/ActivityPictures');
const Facilities = require('../entities/Facilities');
const ActivityFacilities = require('../entities/ActivityFacilities');
const Levels = require('../entities/Levels');
const ActivityLevels = require('../entities/ActivityLevels');
const Cities = require('../entities/Cities');
const MemberFavoriteActivities = require('../entities/MemberFavoriteActivities');
const PointsRecord = require('../entities/PointsRecord');
const PointsOrder = require('../entities/PointsOrder');
const PointsPlan = require('../entities/PointsPlan');
const ActivityRegister = require('../entities/ActivityRegister');

const dataSource = new DataSource({
  type: 'postgres',
  host: config.get('db.host'),
  port: config.get('db.port'),
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  synchronize: config.get('db.synchronize'),
  poolSize: 10,
  entities: [
    Members,
    Activities,
    ActivityPictures,
    Facilities,
    ActivityFacilities,
    Levels,
    ActivityLevels,
    Cities,
    MemberFavoriteActivities,
    PointsRecord,
    PointsOrder,
    PointsPlan,
    ActivityRegister,
  ],
  migrations: ['src/migrations/*.js'],
  ssl: config.get('db.ssl'),
});

module.exports = { dataSource };
