const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cities',
  tableName: 'CITIES',
  columns: {
    zip_code: {
      primary: true,
      type: 'varchar',
      length: 10,
      nullable: false,
    },
    city: {
      type: 'varchar',
      length: 10,
      nullable: false,
    },
    district: {
      type: 'varchar',
      length: 10,
      nullable: false,
    },
  },
});
