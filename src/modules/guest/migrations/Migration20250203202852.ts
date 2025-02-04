import { Migration } from '@mikro-orm/migrations';

export class Migration20250203202852 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "guest" ("id" text not null, "current_stage" text not null default \'initial\', "phone_number" text null, "phone_verified" boolean not null default false, "email" text null, "password" text null, "name" text null, "last_name" text null, "address_line1" text null, "address_line2" text null, "address_line3" text null, "city" text null, "province" text null, "postal_code" text null, "country" text null, "neighborhood" text null, "region" text null, "district" text null, "expires_at" timestamptz not null, "phone_verification_code" text null, "last_active_at" timestamptz not null, "token" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "guest_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "GUEST_CURRENT_STAGE" ON "guest" (current_stage) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "GUEST_LAST_ACTIVE_AT" ON "guest" (last_active_at) WHERE deleted_at IS NULL;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_guest_token_unique" ON "guest" (token) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "GUEST_TOKEN" ON "guest" (token) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_guest_deleted_at" ON "guest" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "stage_history" ("id" text not null, "stage" text not null default \'initial\', "completed_at" timestamptz null, "guest_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "stage_history_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_stage_history_guest_id" ON "stage_history" (guest_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_stage_history_deleted_at" ON "stage_history" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "utm_source" ("id" text not null, "name" text not null, "source" text not null, "medium" text not null, "campaign" text not null, "content" text null, "term" text null, "short_path" text not null, "destination_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "utm_source_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_utm_source_short_path_unique" ON "utm_source" (short_path) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_source_deleted_at" ON "utm_source" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "utm_visit" ("id" text not null, "ip_address" text null, "user_agent" text null, "referrer" text null, "guest_id" text not null, "utm_source_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "utm_visit_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_visit_guest_id" ON "utm_visit" (guest_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_visit_utm_source_id" ON "utm_visit" (utm_source_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_utm_visit_deleted_at" ON "utm_visit" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "stage_history" add constraint "stage_history_guest_id_foreign" foreign key ("guest_id") references "guest" ("id") on update cascade;');

    this.addSql('alter table if exists "utm_visit" add constraint "utm_visit_guest_id_foreign" foreign key ("guest_id") references "guest" ("id") on update cascade;');
    this.addSql('alter table if exists "utm_visit" add constraint "utm_visit_utm_source_id_foreign" foreign key ("utm_source_id") references "utm_source" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "stage_history" drop constraint if exists "stage_history_guest_id_foreign";');

    this.addSql('alter table if exists "utm_visit" drop constraint if exists "utm_visit_guest_id_foreign";');

    this.addSql('alter table if exists "utm_visit" drop constraint if exists "utm_visit_utm_source_id_foreign";');

    this.addSql('drop table if exists "guest" cascade;');

    this.addSql('drop table if exists "stage_history" cascade;');

    this.addSql('drop table if exists "utm_source" cascade;');

    this.addSql('drop table if exists "utm_visit" cascade;');
  }

}
