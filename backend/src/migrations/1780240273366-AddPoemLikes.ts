import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPoemLikes1780240273366 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const cols = await queryRunner.query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'poems' AND COLUMN_NAME = 'like_count'`,
        );
        if (cols.length === 0) {
            await queryRunner.query(
                `ALTER TABLE \`poems\` ADD \`like_count\` int NOT NULL DEFAULT 0`,
            );
        }

        const tables = await queryRunner.query(
            `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'poem_likes'`,
        );
        if (tables.length === 0) {
            await queryRunner.query(`
                CREATE TABLE \`poem_likes\` (
                    \`user_id\` int NOT NULL,
                    \`poem_id\` int NOT NULL,
                    \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (\`user_id\`, \`poem_id\`),
                    CONSTRAINT \`FK_poem_likes_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
                    CONSTRAINT \`FK_poem_likes_poem\` FOREIGN KEY (\`poem_id\`) REFERENCES \`poems\` (\`id\`) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`poem_likes\``);
        await queryRunner.query(`ALTER TABLE \`poems\` DROP COLUMN \`like_count\``);
    }

}
