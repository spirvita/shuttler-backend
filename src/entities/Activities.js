const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Activities',
  tableName: 'ACTIVITIES',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    member_id: {
      type: 'uuid',
      generated: 'uuid',
      nullable: false,
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    start_time: {
      type: 'timestamp',
      nullable: false,
    },
    end_time: {
      type: 'timestamp',
      nullable: false,
    },
    venue_name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    zip_code: {
      type: 'integer',
      nullable: false,
    },
    address: {
      type: 'varchar',
      length: 255,
      nullable: false,
    },
    ball_type: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    participant_count: {
      type: 'integer',
      nullable: false,
    },
    booked_count: {
      type: 'integer',
      nullable: false,
    }, 
    rental_lot: {
      type: 'integer',
      nullable: false,
    },
    event_brief: {
      type: 'text',
      nullable: false,
    },
    contact_name: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    contact_phone: {
      type: 'integer',
      nullable: false,
    },
    contact_line: {
      type: 'varchar',
      length: 50,
      nullable: false,
    },
    points: {
      type: 'integer',
      nullable: false,
    },
    is_published: {
      type: 'boolean',
      default: false,
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
      inverseSide: 'activities',
      joinColumn: {
        name: 'member_id',
        referencedColumnName: 'id',
      },
    },
  }

});
