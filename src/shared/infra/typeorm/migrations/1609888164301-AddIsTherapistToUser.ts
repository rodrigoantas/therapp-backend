import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIsTherapistToUser1609888164301
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'is_therapist',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'is_therapist');
  }
}
