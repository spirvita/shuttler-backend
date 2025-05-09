const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Facilities',
  tableName: 'FACILITIES',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
  },
  relations: {
    activityFacilities: {
      target: 'ActivityFacilities',
      type: 'one-to-many',
      inverseSide: 'Facilities',
      joinColumn: {
        name: 'id',
        referencedColumnName: 'facility_id',
      },
    },
  },
});
