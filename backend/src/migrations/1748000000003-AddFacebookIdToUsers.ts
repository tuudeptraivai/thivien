import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFacebookIdToUsers1748000000003 implements MigrationInterface {
  name = 'AddFacebookIdToUsers1748000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`users\`
      ADD COLUMN \`facebook_id\` VARCHAR(50) NULL AFTER \`avatar_url\`,
      ADD UNIQUE INDEX \`UQ_users_facebook_id\` (\`facebook_id\`)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP INDEX \`UQ_users_facebook_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`facebook_id\``,
    );
  }
}
