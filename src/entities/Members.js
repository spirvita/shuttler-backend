const { EntitySchema } = require('typeorm');
const Levels = require('./Levels');

module.exports = new EntitySchema({
  name: 'Members',
  tableName: 'MEMBERS',
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
    email: {
      type: 'varchar',
      length: 320,
      nullable: false,
      unique: true,
    },
    password: {
      type: 'varchar',
      length: 72,
      nullable: false,
      select: false,
    },
    photo: {
      type: 'text',
      nullable: true,
    },
    level_id: {
      type: 'uuid',
      nullable: true,
    },
    region: {
      type: 'varchar',
      length: 50,
      array: true,
      nullable: true,
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
    activities: {
      target: 'Activities',
      type: 'one-to-many',
      inverseSide: 'Members',
      joinColumn: {
        name: 'id',
        referencedColumnName: 'member_id',
      },
    },
    level: {
      target: Levels,
      type: 'many-to-one',
      inverseSide: 'Members',
      joinColumn: {
        name: 'level_id',
        referencedColumnName: 'id',
      },
    },
  },
});
