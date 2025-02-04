import { Migration } from '@mikro-orm/migrations';

export class Migration20250204091711 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "shortlink" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "shortlink" ("id" text not null, "code" text not null, "name" text not null, "campaign_name" text not null, "source" text not null, "medium" text not null, "content" text null, "term" text null, "destination_url" text not null default \'/\', "visits" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "shortlink_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_shortlink_deleted_at" ON "shortlink" (deleted_at) WHERE deleted_at IS NULL;');
  }

}
