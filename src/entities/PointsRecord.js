const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PointsRecord',
  tableName: 'POINTS_RECORD',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    activity_id: {
      type: 'uuid',
      nullable: true,
    },
    member_id: {
      type: 'uuid',
      nullable: false,
    },
    points_change: {
      type: 'int',
      nullable: false,
    },
    recordType: {
      type: 'enum',
      enum: ['addPoint', 'applyAct', 'cancelAct', 'suspendAct'],
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
      inverseSide: 'pointsRecords',
      joinColumn: {
        name: 'member_id',
        referencedColumnName: 'id',
      },
    },
  },
});
