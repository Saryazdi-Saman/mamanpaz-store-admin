import { Migration } from '@mikro-orm/migrations';

export class Migration20250210025648 extends Migration {

  async up(): Promise<void> {
    this.addSql('drop table if exists "price_tier" cascade;');

    this.addSql('alter table if exists "delivery_plan" add column if not exists "title" text not null, add column if not exists "day1" integer not null default 0, add column if not exists "day2" integer not null default 0, add column if not exists "day3" integer not null default 0, add column if not exists "day4" integer not null default 0, add column if not exists "day5" integer not null default 0, add column if not exists "day6" integer not null default 0, add column if not exists "day7" integer not null default 0;');
    this.addSql('drop index if exists "IDX_delivery_plan_slug_unique";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "name";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "slug";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "is_active";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "price";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "monday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "tuesday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "wednesday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "thursday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "friday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "saturday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "sunday";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "raw_price";');

    this.addSql('alter table if exists "plan" add column if not exists "name" text not null, add column if not exists "slug" text not null, add column if not exists "meals_per_week" integer not null, add column if not exists "meals_per_day" integer not null, add column if not exists "price_per_meal" numeric not null, add column if not exists "category_id" text not null, add column if not exists "raw_price_per_meal" jsonb not null;');
    this.addSql('alter table if exists "plan" add constraint "plan_category_id_foreign" foreign key ("category_id") references "plan_category" ("id") on update cascade on delete cascade;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_plan_slug_unique" ON "plan" (slug) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_plan_category_id" ON "plan" (category_id) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('create table if not exists "price_tier" ("id" text not null, "name" text not null, "slug" text not null, "meals_per_week" integer not null, "meals_per_day" integer not null, "price_per_meal" numeric not null, "category_id" text not null, "raw_price_per_meal" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "price_tier_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_tier_slug_unique" ON "price_tier" (slug) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_price_tier_category_id" ON "price_tier" (category_id) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_price_tier_deleted_at" ON "price_tier" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "price_tier" add constraint "price_tier_category_id_foreign" foreign key ("category_id") references "plan_category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table if exists "plan" drop constraint if exists "plan_category_id_foreign";');

    this.addSql('alter table if exists "delivery_plan" add column if not exists "slug" text not null, add column if not exists "is_active" boolean not null default true, add column if not exists "price" numeric not null, add column if not exists "monday" integer not null default 0, add column if not exists "tuesday" integer not null default 0, add column if not exists "wednesday" integer not null default 0, add column if not exists "thursday" integer not null default 0, add column if not exists "friday" integer not null default 0, add column if not exists "saturday" integer not null default 0, add column if not exists "sunday" integer not null default 0, add column if not exists "raw_price" jsonb not null;');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day1";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day2";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day3";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day4";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day5";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day6";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "day7";');
    this.addSql('alter table if exists "delivery_plan" rename column "title" to "name";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_delivery_plan_slug_unique" ON "delivery_plan" (slug) WHERE deleted_at IS NULL;');

    this.addSql('drop index if exists "IDX_plan_slug_unique";');
    this.addSql('drop index if exists "IDX_plan_category_id";');
    this.addSql('alter table if exists "plan" drop column if exists "name";');
    this.addSql('alter table if exists "plan" drop column if exists "slug";');
    this.addSql('alter table if exists "plan" drop column if exists "meals_per_week";');
    this.addSql('alter table if exists "plan" drop column if exists "meals_per_day";');
    this.addSql('alter table if exists "plan" drop column if exists "price_per_meal";');
    this.addSql('alter table if exists "plan" drop column if exists "category_id";');
    this.addSql('alter table if exists "plan" drop column if exists "raw_price_per_meal";');
  }

}
