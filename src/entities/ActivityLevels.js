const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ActivityLevels',
  tableName: 'ACTIVITY_LEVELS',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    activity_id: {
      type: 'uuid',
      nullable: false,
    },
    level_id: {
      type: 'uuid',
      nullable: false,
    },
    created_at: {
      type: 'timestamp',
      nullable: false,
      createDate: true,
    },
    updated_at: {
      type: 'timestamp',
      nullable: false,
      updateDate: true,
    },
  },
  relations: {
    activity: {
      target: 'Activities',
      type: 'many-to-one',
      inverseSide: 'ActivityLevels',
      joinColumn: {
        name: 'activity_id',
        referencedColumnName: 'id',
      },
    },
    level: {
      target: 'Levels',
      type: 'many-to-one',
      inverseSide: 'ActivityLevels',
      joinColumn: {
        name: 'level_id',
        referencedColumnName: 'id',
      },
    },
  },
});
