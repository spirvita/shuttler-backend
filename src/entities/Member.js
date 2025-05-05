const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Member',
  tableName: 'MEMBER',
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
      type: 'varchar',
      length: 255,
      nullable: true,
    },
    skill_level: {
      type: 'int',
      array: true,
      nullable: true,
    },
    region: {
      type: 'int',
      array: true,
      nullable: true,
    },
    total_point: {
      type: 'int',
      default: 0,
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
});
