import { Migration } from '@mikro-orm/migrations';

export class Migration20250126182404 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "delivery_plan" add column if not exists "slug" text not null;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_delivery_plan_slug_unique" ON "delivery_plan" (slug) WHERE deleted_at IS NULL;');

    this.addSql('alter table if exists "price_tier" add column if not exists "slug" text not null;');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_price_tier_slug_unique" ON "price_tier" (slug) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_delivery_plan_slug_unique";');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "slug";');

    this.addSql('drop index if exists "IDX_price_tier_slug_unique";');
    this.addSql('alter table if exists "price_tier" drop column if exists "slug";');
  }

}
