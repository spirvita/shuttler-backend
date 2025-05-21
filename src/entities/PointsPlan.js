const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PointsPlan',
  tableName: 'POINTS_PLAN',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    points: {
      type: 'int',
      nullable: false,
    },
    value: {
      type: 'int',
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
    pointsOrders: {
      target: 'PointsOrder',
      type: 'one-to-many',
      inverseSide: 'pointsPlan',
      joinColumn: {
        name: 'id',
        referencedColumnName: 'points_plan_id',
      },
    },
  },
});
