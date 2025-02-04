import { Migration } from '@mikro-orm/migrations';

export class Migration20250204083131 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "qr-link" ("id" text not null, "code" text not null, "name" text not null, "campaign_name" text not null, "source" text not null, "medium" text not null, "content" text null, "term" text null, "destination_url" text not null default \'/\', "visits" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "qr-link_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_qr-link_deleted_at" ON "qr-link" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('drop index if exists "IDX_shortlink_code_unique";');
    this.addSql('drop index if exists "IDX_shortlink_code";');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "qr-link" cascade;');

    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_shortlink_code_unique" ON "shortlink" (code) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shortlink_code" ON "shortlink" (code) WHERE deleted_at IS NULL;');
  }

}
