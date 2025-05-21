const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PointsOrder',
  tableName: 'POINTS_ORDER',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    member_id: {
      type: 'uuid',
      nullable: false,
    },
    points_plan_id: {
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
    member: {
      target: 'Members',
      type: 'many-to-one',
      inverseSide: 'pointsOrders',
      joinColumn: {
        name: 'member_id',
        referencedColumnName: 'id',
      },
    },
    pointsPlan: {
      target: 'PointsPlan',
      type: 'many-to-one',
      inverseSide: 'pointsOrders',
      joinColumn: {
        name: 'points_plan_id',
        referencedColumnName: 'id',
      },
    },
  },
});
