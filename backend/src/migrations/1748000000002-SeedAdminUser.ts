import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1748000000002 implements MigrationInterface {
  name = 'SeedAdminUser1748000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const passwordHash = await bcrypt.hash('admin@123', 12);

    await queryRunner.query(`
      INSERT IGNORE INTO \`users\`
        (\`username\`, \`email\`, \`password_hash\`, \`display_name\`, \`role\`, \`is_active\`)
      VALUES
        ('admin', 'admin@gmail.com', '${passwordHash}', 'Quản trị viên', 'admin', 1)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`users\` WHERE \`email\` = 'admin@gmail.com'`);
  }
}
