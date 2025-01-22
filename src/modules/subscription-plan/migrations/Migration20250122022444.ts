import { Migration } from '@mikro-orm/migrations';

export class Migration20250122022444 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "delivery_plan" add column if not exists "raw_price" jsonb not null;');
    this.addSql('alter table if exists "delivery_plan" alter column "price" type numeric using ("price"::numeric);');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "delivery_plan" alter column "price" type integer using ("price"::integer);');
    this.addSql('alter table if exists "delivery_plan" drop column if exists "raw_price";');
  }

}
