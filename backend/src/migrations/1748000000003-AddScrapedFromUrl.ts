import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScrapedFromUrl1748000000003 implements MigrationInterface {
  name = 'AddScrapedFromUrl1748000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`authors\`
        ADD COLUMN \`scraped_from_url\` VARCHAR(500) NULL,
        ADD UNIQUE INDEX \`UQ_authors_scraped_from_url\` (\`scraped_from_url\`)
    `);

    await queryRunner.query(`
      ALTER TABLE \`poems\`
        ADD COLUMN \`scraped_from_url\` VARCHAR(500) NULL,
        ADD UNIQUE INDEX \`UQ_poems_scraped_from_url\` (\`scraped_from_url\`)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`poems\`
        DROP INDEX \`UQ_poems_scraped_from_url\`,
        DROP COLUMN \`scraped_from_url\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`authors\`
        DROP INDEX \`UQ_authors_scraped_from_url\`,
        DROP COLUMN \`scraped_from_url\`
    `);
  }
}
