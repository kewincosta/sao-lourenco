import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Schema inicial: users, services e reviews.
 * Relacionamentos: users 1—N services 1—N reviews.
 */
export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            uuid         NOT NULL DEFAULT uuid_generate_v4(),
        "name"          varchar(150) NOT NULL,
        "document"      varchar(14)  NOT NULL,
        "document_type" varchar(4)   NOT NULL,
        "email"         varchar(255) NOT NULL,
        "whatsapp"      varchar(20)  NOT NULL,
        "address"       varchar(255) NOT NULL,
        "created_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_document" UNIQUE ("document")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "services" (
        "id"          uuid          NOT NULL DEFAULT uuid_generate_v4(),
        "user_id"     uuid          NOT NULL,
        "title"       varchar(150)  NOT NULL,
        "description" text          NOT NULL,
        "category"    varchar(80)   NOT NULL,
        "price"       numeric(10,2) NOT NULL,
        "city"        varchar(120)  NOT NULL,
        "state"       varchar(2)    NOT NULL,
        "created_at"  TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services" PRIMARY KEY ("id"),
        CONSTRAINT "FK_services_user" FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_services_user_id" ON "services" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE "reviews" (
        "id"         uuid        NOT NULL DEFAULT uuid_generate_v4(),
        "service_id" uuid        NOT NULL,
        "rating"     integer     NOT NULL,
        "comment"    text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_reviews" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_reviews_rating" CHECK ("rating" BETWEEN 1 AND 5),
        CONSTRAINT "FK_reviews_service" FOREIGN KEY ("service_id")
          REFERENCES "services" ("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_reviews_service_id" ON "reviews" ("service_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "services"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
