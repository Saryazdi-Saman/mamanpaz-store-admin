import { Migration } from '@mikro-orm/migrations';

export class Migration20250210060008 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "delivery_plan" ("id" text not null, "title" text not null, "day1" integer not null default 0, "day2" integer not null default 0, "day3" integer not null default 0, "day4" integer not null default 0, "day5" integer not null default 0, "day6" integer not null default 0, "day7" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "delivery_plan_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_delivery_plan_deleted_at" ON "delivery_plan" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "plan_category" ("id" text not null, "name" text not null, "is_active" boolean not null default true, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plan_category_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_category_deleted_at" ON "plan_category" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "plan" ("id" text not null, "name" text not null, "slug" text not null, "meals_per_week" integer not null, "meals_per_day" integer not null, "price_per_meal" numeric not null, "category_id" text not null, "delivery_schedule_id" text not null, "raw_price_per_meal" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "plan_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_plan_slug_unique" ON "plan" (slug) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_category_id" ON "plan" (category_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_delivery_schedule_id" ON "plan" (delivery_schedule_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_deleted_at" ON "plan" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "plan" add constraint "plan_category_id_foreign" foreign key ("category_id") references "plan_category" ("id") on update cascade on delete cascade;');
    this.addSql('alter table if exists "plan" add constraint "plan_delivery_schedule_id_foreign" foreign key ("delivery_schedule_id") references "delivery_plan" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "plan" drop constraint if exists "plan_delivery_schedule_id_foreign";');

    this.addSql('alter table if exists "plan" drop constraint if exists "plan_category_id_foreign";');

    this.addSql('drop table if exists "delivery_plan" cascade;');

    this.addSql('drop table if exists "plan_category" cascade;');

    this.addSql('drop table if exists "plan" cascade;');
  }

}
