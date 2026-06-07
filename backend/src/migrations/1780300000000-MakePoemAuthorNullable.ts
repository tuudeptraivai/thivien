import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePoemAuthorNullable1780300000000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [col] = await queryRunner.query(
            `SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'poems' AND COLUMN_NAME = 'author_id'`,
        );
        if (col && col.IS_NULLABLE === 'NO') {
            await queryRunner.query(`ALTER TABLE \`poems\` MODIFY \`author_id\` int NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`poems\` MODIFY \`author_id\` int NOT NULL`);
    }

}
