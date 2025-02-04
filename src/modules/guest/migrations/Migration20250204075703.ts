import { Migration } from '@mikro-orm/migrations';

export class Migration20250204075703 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "utm_visit" drop constraint if exists "utm_visit_utm_source_id_foreign";');

    this.addSql('create table if not exists "visit" ("id" text not null, "ip_address" text null, "user_agent" text null, "referrer" text null, "utm_source" text null, "utm_medium" text null, "utm_campaign" text null, "utm_content" text null, "utm_term" text null, "guest_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "visit_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_visit_guest_id" ON "visit" (guest_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_visit_deleted_at" ON "visit" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "visit" add constraint "visit_guest_id_foreign" foreign key ("guest_id") references "guest" ("id") on update cascade;');

    this.addSql('drop table if exists "utm_source" cascade;');

    this.addSql('drop table if exists "utm_visit" cascade;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "utm_source" ("id" text not null, "name" text not null, "campaign_name" text not null, "source" text not null, "medium" text not null, "content" text null, "term" text null, "short_path" text not null, "destination_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "utm_source_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_utm_source_short_path_unique" ON "utm_source" (short_path) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_source_deleted_at" ON "utm_source" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "utm_visit" ("id" text not null, "ip_address" text null, "user_agent" text null, "referrer" text null, "guest_id" text not null, "utm_source_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "utm_visit_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_visit_guest_id" ON "utm_visit" (guest_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_visit_utm_source_id" ON "utm_visit" (utm_source_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_visit_deleted_at" ON "utm_visit" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "utm_visit" add constraint "utm_visit_guest_id_foreign" foreign key ("guest_id") references "guest" ("id") on update cascade;');
    this.addSql('alter table if exists "utm_visit" add constraint "utm_visit_utm_source_id_foreign" foreign key ("utm_source_id") references "utm_source" ("id") on update cascade;');

    this.addSql('drop table if exists "visit" cascade;');
  }

}
