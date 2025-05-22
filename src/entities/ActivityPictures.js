const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ActivityPictures',
  tableName: 'ACTIVITY_PICTURES',
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
    url: {
      type: 'text',
      nullable: false,
    },
    sort_order: {
      type: 'int',
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
      inverseSide: 'ActivityPictures',
      joinColumn: {
        name: 'activity_id',
        referencedColumnName: 'id',
      },
    },
  },
});
