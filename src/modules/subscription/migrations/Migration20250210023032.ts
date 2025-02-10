import { Migration } from '@mikro-orm/migrations';

export class Migration20250210023032 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "delivery_plan" ("id" text not null, "name" text not null, "slug" text not null, "is_active" boolean not null default true, "price" numeric not null, "monday" integer not null default 0, "tuesday" integer not null default 0, "wednesday" integer not null default 0, "thursday" integer not null default 0, "friday" integer not null default 0, "saturday" integer not null default 0, "sunday" integer not null default 0, "raw_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_plan_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_delivery_plan_slug_unique" ON "delivery_plan" (slug) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_delivery_plan_deleted_at" ON "delivery_plan" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "plan" ("id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plan_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_deleted_at" ON "plan" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "plan_category" ("id" text not null, "name" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plan_category_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_category_deleted_at" ON "plan_category" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "price_tier" ("id" text not null, "name" text not null, "slug" text not null, "meals_per_week" integer not null, "meals_per_day" integer not null, "price_per_meal" numeric not null, "category_id" text not null, "raw_price_per_meal" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_tier_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_tier_slug_unique" ON "price_tier" (slug) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_price_tier_category_id" ON "price_tier" (category_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_price_tier_deleted_at" ON "price_tier" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "price_tier" add constraint "price_tier_category_id_foreign" foreign key ("category_id") references "plan_category" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "price_tier" drop constraint if exists "price_tier_category_id_foreign";');

    this.addSql('drop table if exists "delivery_plan" cascade;');

    this.addSql('drop table if exists "plan" cascade;');

    this.addSql('drop table if exists "plan_category" cascade;');

    this.addSql('drop table if exists "price_tier" cascade;');
  }

}
