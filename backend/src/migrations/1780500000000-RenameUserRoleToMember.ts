import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Đổi tên vai trò RBAC 'user' → 'member' cho khớp với role thật của tài khoản
 * (User.role mặc định là 'member'). Idempotent: chỉ đổi khi còn 'user' và chưa
 * có 'member'.
 */
export class RenameUserRoleToMember1780500000000
  implements MigrationInterface
{
  name = 'RenameUserRoleToMember1780500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasUser = await queryRunner.query(
      `SELECT id FROM \`roles\` WHERE name = 'user' LIMIT 1`,
    );
    const hasMember = await queryRunner.query(
      `SELECT id FROM \`roles\` WHERE name = 'member' LIMIT 1`,
    );
    if (hasUser.length && !hasMember.length) {
      await queryRunner.query(
        `UPDATE \`roles\`
           SET name = 'member',
               description = 'Thành viên — quyền xem cơ bản'
         WHERE name = 'user'`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasMember = await queryRunner.query(
      `SELECT id FROM \`roles\` WHERE name = 'member' LIMIT 1`,
    );
    const hasUser = await queryRunner.query(
      `SELECT id FROM \`roles\` WHERE name = 'user' LIMIT 1`,
    );
    if (hasMember.length && !hasUser.length) {
      await queryRunner.query(
        `UPDATE \`roles\`
           SET name = 'user',
               description = 'Người dùng thường — quyền xem cơ bản'
         WHERE name = 'member'`,
      );
    }
  }
}
