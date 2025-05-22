const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'MemberFavoriteActivities',
  tableName: 'MEMBER_FAVORITE_ACTIVITIES',
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
    activity_id: {
      type: 'uuid',
      nullable: false,
    },
    created_at: {
      type: 'timestamptz',
      nullable: false,
      createDate: true,
    },
  },
  relations: {
    member: {
      target: 'Members',
      type: 'many-to-one',
      inverseSide: 'MemberFavoriteActivities',
      joinColumn: {
        name: 'member_id',
        referencedColumnName: 'id',
      },
    },
    activity: {
      target: 'Activities',
      type: 'many-to-one',
      inverseSide: 'MemberFavoriteActivities',
      joinColumn: {
        name: 'activity_id',
        referencedColumnName: 'id',
      },
    },
  },
});
