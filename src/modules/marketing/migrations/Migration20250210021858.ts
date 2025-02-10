import { Migration } from '@mikro-orm/migrations';

export class Migration20250210021858 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "qr-link" ("id" text not null, "link" text not null, "name" text not null, "campaign_name" text not null, "source" text not null, "medium" text not null, "content" text null, "term" text null, "destination_url" text not null default \'/\', "visits" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "qr-link_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_qr-link_link_unique" ON "qr-link" (link) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_qr-link_deleted_at" ON "qr-link" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "qr-link" cascade;');
  }

}
