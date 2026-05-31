import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1748000000000 implements MigrationInterface {
  name = 'InitSchema1748000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── 1. countries ──────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`countries\` (
        \`id\`          INT NOT NULL AUTO_INCREMENT,
        \`name\`        VARCHAR(100) NOT NULL,
        \`iso_code\`    VARCHAR(10)  NULL,
        \`flag_url\`    VARCHAR(255) NULL,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_countries_name\`     (\`name\`),
        UNIQUE INDEX \`UQ_countries_iso_code\` (\`iso_code\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 2. eras ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`eras\` (
        \`id\`          INT NOT NULL AUTO_INCREMENT,
        \`name\`        VARCHAR(100) NOT NULL,
        \`description\` TEXT         NULL,
        \`start_year\`  INT          NULL,
        \`end_year\`    INT          NULL,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_eras_name\` (\`name\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 3. poem_categories ────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`poem_categories\` (
        \`id\`          INT NOT NULL AUTO_INCREMENT,
        \`name\`        VARCHAR(100) NOT NULL,
        \`slug\`        VARCHAR(100) NOT NULL,
        \`description\` TEXT         NULL,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_poem_categories_name\` (\`name\`),
        UNIQUE INDEX \`UQ_poem_categories_slug\` (\`slug\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 4. users ──────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\`                INT          NOT NULL AUTO_INCREMENT,
        \`username\`          VARCHAR(50)  NOT NULL,
        \`email\`             VARCHAR(100) NOT NULL,
        \`password_hash\`     VARCHAR(255) NOT NULL,
        \`display_name\`      VARCHAR(100) NOT NULL,
        \`avatar_url\`        VARCHAR(255) NULL,
        \`role\`              VARCHAR(20)  NOT NULL DEFAULT 'member',
        \`vn_typing_mode\`    INT          NOT NULL DEFAULT 3,
        \`theme_preference\`  VARCHAR(20)  NOT NULL DEFAULT 'system',
        \`font_preference\`   VARCHAR(50)  NOT NULL DEFAULT 'Lora',
        \`is_active\`         TINYINT(1)   NOT NULL DEFAULT 1,
        \`created_at\`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_users_username\` (\`username\`),
        UNIQUE INDEX \`UQ_users_email\`    (\`email\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 5. authors ────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`authors\` (
        \`id\`           INT          NOT NULL AUTO_INCREMENT,
        \`name\`         VARCHAR(150) NOT NULL,
        \`slug\`         VARCHAR(150) NOT NULL,
        \`real_name\`    VARCHAR(150) NULL,
        \`birth_year\`   VARCHAR(50)  NULL,
        \`death_year\`   VARCHAR(50)  NULL,
        \`country_id\`   INT          NULL,
        \`era_id\`       INT          NULL,
        \`biography\`    TEXT         NULL,
        \`portrait_url\` VARCHAR(255) NULL,
        \`view_count\`   INT          NOT NULL DEFAULT 0,
        \`is_verified\`  TINYINT(1)   NOT NULL DEFAULT 0,
        \`created_by\`   INT          NULL,
        \`created_at\`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_authors_slug\` (\`slug\`),
        INDEX \`IDX_authors_country_id\` (\`country_id\`),
        INDEX \`IDX_authors_era_id\`     (\`era_id\`),
        INDEX \`IDX_authors_created_by\` (\`created_by\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_authors_country\`     FOREIGN KEY (\`country_id\`) REFERENCES \`countries\` (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_authors_era\`         FOREIGN KEY (\`era_id\`)     REFERENCES \`eras\`      (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_authors_created_by\`  FOREIGN KEY (\`created_by\`) REFERENCES \`users\`    (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 6. poems ──────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`poems\` (
        \`id\`             INT          NOT NULL AUTO_INCREMENT,
        \`title\`          VARCHAR(255) NOT NULL,
        \`slug\`           VARCHAR(255) NOT NULL,
        \`author_id\`      INT          NOT NULL,
        \`category_id\`    INT          NULL,
        \`era_id\`         INT          NULL,
        \`source_info\`    VARCHAR(255) NULL,
        \`view_count\`     INT          NOT NULL DEFAULT 0,
        \`is_member_poem\` TINYINT(1)   NOT NULL DEFAULT 0,
        \`status\`         VARCHAR(20)  NOT NULL DEFAULT 'published',
        \`created_by\`     INT          NULL,
        \`created_at\`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_poems_slug\`       (\`slug\`),
        INDEX \`IDX_poems_author_id\`        (\`author_id\`),
        INDEX \`IDX_poems_category_id\`      (\`category_id\`),
        INDEX \`IDX_poems_era_id\`           (\`era_id\`),
        INDEX \`IDX_poems_is_member_poem\`   (\`is_member_poem\`),
        INDEX \`IDX_poems_status\`           (\`status\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_poems_author\`       FOREIGN KEY (\`author_id\`)   REFERENCES \`authors\`         (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_poems_category\`     FOREIGN KEY (\`category_id\`) REFERENCES \`poem_categories\` (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_poems_era\`          FOREIGN KEY (\`era_id\`)      REFERENCES \`eras\`            (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_poems_created_by\`   FOREIGN KEY (\`created_by\`)  REFERENCES \`users\`          (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 7. poem_versions ──────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`poem_versions\` (
        \`id\`            INT          NOT NULL AUTO_INCREMENT,
        \`poem_id\`       INT          NOT NULL,
        \`version_name\`  VARCHAR(100) NOT NULL DEFAULT 'Bản chuẩn',
        \`content\`       TEXT         NOT NULL,
        \`transcription\` TEXT         NULL,
        \`explanation\`   TEXT         NULL,
        \`is_primary\`    TINYINT(1)   NOT NULL DEFAULT 1,
        \`created_at\`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX \`IDX_poem_versions_poem_id\` (\`poem_id\`),
        FULLTEXT INDEX \`FT_poem_versions_content\` (\`content\`, \`transcription\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_poem_versions_poem\` FOREIGN KEY (\`poem_id\`) REFERENCES \`poems\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 8. translations ───────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`translations\` (
        \`id\`                  INT          NOT NULL AUTO_INCREMENT,
        \`poem_version_id\`     INT          NOT NULL,
        \`translator_id\`       INT          NULL,
        \`translator_user_id\`  INT          NULL,
        \`translation_title\`   VARCHAR(255) NULL,
        \`content\`             TEXT         NOT NULL,
        \`translation_type\`    VARCHAR(50)  NOT NULL DEFAULT 'Thơ',
        \`is_favorite\`         TINYINT(1)   NOT NULL DEFAULT 0,
        \`created_at\`          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX \`IDX_translations_poem_version_id\` (\`poem_version_id\`),
        INDEX \`IDX_translations_is_favorite\`     (\`is_favorite\`),
        INDEX \`IDX_translations_translator_id\`   (\`translator_id\`),
        INDEX \`IDX_translations_tr_user_id\`      (\`translator_user_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_translations_poem_version\`     FOREIGN KEY (\`poem_version_id\`)    REFERENCES \`poem_versions\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_translations_translator\`       FOREIGN KEY (\`translator_id\`)      REFERENCES \`authors\`      (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_translations_translator_user\`  FOREIGN KEY (\`translator_user_id\`) REFERENCES \`users\`        (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 9. annotations ────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`annotations\` (
        \`id\`          INT          NOT NULL AUTO_INCREMENT,
        \`keyword\`     VARCHAR(100) NOT NULL,
        \`explanation\` TEXT         NOT NULL,
        \`type\`        VARCHAR(50)  NOT NULL DEFAULT 'vocabulary',
        \`source\`      VARCHAR(255) NULL,
        \`created_by\`  INT          NULL,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_annotations_keyword\` (\`keyword\`),
        INDEX \`IDX_annotations_created_by\`   (\`created_by\`),
        FULLTEXT INDEX \`FT_annotations_keyword\` (\`keyword\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_annotations_created_by\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 10. poem_annotations ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`poem_annotations\` (
        \`poem_id\`       INT NOT NULL,
        \`annotation_id\` INT NOT NULL,
        INDEX \`IDX_poem_annotations_annotation_id\` (\`annotation_id\`),
        PRIMARY KEY (\`poem_id\`, \`annotation_id\`),
        CONSTRAINT \`FK_poem_annotations_poem\`       FOREIGN KEY (\`poem_id\`)       REFERENCES \`poems\`       (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_poem_annotations_annotation\` FOREIGN KEY (\`annotation_id\`) REFERENCES \`annotations\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 11. comments ──────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`comments\` (
        \`id\`          INT          NOT NULL AUTO_INCREMENT,
        \`entity_type\` VARCHAR(20)  NOT NULL,
        \`entity_id\`   INT          NOT NULL,
        \`user_id\`     INT          NULL,
        \`guest_name\`  VARCHAR(100) NULL,
        \`guest_email\` VARCHAR(100) NULL,
        \`content\`     TEXT         NOT NULL,
        \`status\`      VARCHAR(20)  NOT NULL DEFAULT 'approved',
        \`parent_id\`   INT          NULL,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX \`IDX_comments_entity\`    (\`entity_type\`, \`entity_id\`),
        INDEX \`IDX_comments_parent_id\` (\`parent_id\`),
        INDEX \`IDX_comments_user_id\`   (\`user_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_comments_user\`   FOREIGN KEY (\`user_id\`)   REFERENCES \`users\`    (\`id\`) ON DELETE SET NULL,
        CONSTRAINT \`FK_comments_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`comments\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 12. forum_categories ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`forum_categories\` (
        \`id\`            INT          NOT NULL AUTO_INCREMENT,
        \`name\`          VARCHAR(150) NOT NULL,
        \`slug\`          VARCHAR(150) NOT NULL,
        \`description\`   TEXT         NULL,
        \`display_order\` INT          NOT NULL DEFAULT 0,
        \`created_at\`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_forum_categories_name\` (\`name\`),
        UNIQUE INDEX \`UQ_forum_categories_slug\` (\`slug\`),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 13. forum_topics ──────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`forum_topics\` (
        \`id\`          INT          NOT NULL AUTO_INCREMENT,
        \`category_id\` INT          NOT NULL,
        \`user_id\`     INT          NOT NULL,
        \`title\`       VARCHAR(255) NOT NULL,
        \`slug\`        VARCHAR(255) NOT NULL,
        \`view_count\`  INT          NOT NULL DEFAULT 0,
        \`is_pinned\`   TINYINT(1)   NOT NULL DEFAULT 0,
        \`is_locked\`   TINYINT(1)   NOT NULL DEFAULT 0,
        \`created_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE INDEX \`UQ_forum_topics_slug\`      (\`slug\`),
        INDEX \`IDX_forum_topics_category_id\`     (\`category_id\`),
        INDEX \`IDX_forum_topics_user_id\`         (\`user_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_forum_topics_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`forum_categories\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_forum_topics_user\`     FOREIGN KEY (\`user_id\`)     REFERENCES \`users\`           (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 14. forum_posts ───────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`forum_posts\` (
        \`id\`         INT        NOT NULL AUTO_INCREMENT,
        \`topic_id\`   INT        NOT NULL,
        \`user_id\`    INT        NOT NULL,
        \`content\`    TEXT       NOT NULL,
        \`parent_id\`  INT        NULL,
        \`created_at\` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX \`IDX_forum_posts_topic_id\`  (\`topic_id\`),
        INDEX \`IDX_forum_posts_user_id\`   (\`user_id\`),
        INDEX \`IDX_forum_posts_parent_id\` (\`parent_id\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_forum_posts_topic\`  FOREIGN KEY (\`topic_id\`)  REFERENCES \`forum_topics\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_forum_posts_user\`   FOREIGN KEY (\`user_id\`)   REFERENCES \`users\`       (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_forum_posts_parent\` FOREIGN KEY (\`parent_id\`) REFERENCES \`forum_posts\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── 15. bookmarks ─────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`bookmarks\` (
        \`user_id\`    INT       NOT NULL,
        \`poem_id\`    INT       NOT NULL,
        \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX \`IDX_bookmarks_poem_id\` (\`poem_id\`),
        PRIMARY KEY (\`user_id\`, \`poem_id\`),
        CONSTRAINT \`FK_bookmarks_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_bookmarks_poem\` FOREIGN KEY (\`poem_id\`) REFERENCES \`poems\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // ─── migrations tracking ───────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`migrations\` (
        \`id\`        INT          NOT NULL AUTO_INCREMENT,
        \`timestamp\` BIGINT       NOT NULL,
        \`name\`      VARCHAR(255) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`bookmarks\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`forum_posts\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`forum_topics\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`forum_categories\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`comments\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`poem_annotations\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`annotations\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`translations\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`poem_versions\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`poems\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`authors\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`users\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`poem_categories\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`eras\``);
    await queryRunner.query(`DROP TABLE IF EXISTS \`countries\``);
  }
}
