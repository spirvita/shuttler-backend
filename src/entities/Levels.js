const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Levels',
  tableName: 'LEVELS',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    level: {
      type: 'integer',
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
  },
  relations: {
    activityLevels: {
      target: 'ActivityLevels',
      type: 'one-to-many',
      inverseSide: 'Levels',
      joinColumn: {
        name: 'id',
        referencedColumnName: 'level_id',
      },
    },
  },
});
