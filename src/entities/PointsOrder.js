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
    trade_no: {
      type: 'varchar',
      length: 255,
      nullable: true,
      unique: true,
    },
    pay_time: {
      type: 'timestamptz',
      nullable: true,
    },
    amount: {
      type: 'int',
      nullable: false,
    },
    merchant_order_no: {
      type: 'varchar',
      length: 255,
      nullable: false,
      unique: true,
    },
    status: {
      type: 'enum',
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      nullable: false,
    },
    created_at: {
      type: 'timestamptz',
      nullable: false,
      createDate: true,
    },
    updated_at: {
      type: 'timestamptz',
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
