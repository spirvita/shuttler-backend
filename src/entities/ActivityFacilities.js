const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ActivityFacilities',
  tableName: 'ACTIVITY_FACILITIES',
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
    facility_id: {
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
      inverseSide: 'ActivityFacilities',
      joinColumn: {
        name: 'activity_id',
        referencedColumnName: 'id',
      },
    },
    facility: {
      target: 'Facilities',
      type: 'many-to-one',
      inverseSide: 'ActivityFacilities',
      joinColumn: {
        name: 'facility_id',
        referencedColumnName: 'id',
      },
    },
  },
});