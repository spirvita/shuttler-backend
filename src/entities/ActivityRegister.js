const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ActivitiesRegister',
  tableName: 'ACTIVITIES_REGISTER',
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
    member_id: {
      type: 'uuid',
      nullable: false,
    },
    // 報名人數
    participant_count: {
      type: 'int',
      nullable: false,
    },
    status: {
      type: 'varchar',
      length: 50,
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
    activity: {
      target: 'Activities',
      type: 'many-to-one',
      inverseSide: 'registrations',
      joinColumn: {
        name: 'activity_id',
        referencedColumnName: 'id',
      },
    },
    member: {
      target: 'Members',
      type: 'many-to-one',
      inverseSide: 'activityRegistrations',
      joinColumn: {
        name: 'member_id',
        referencedColumnName: 'id',
      },
    },
  },
});
