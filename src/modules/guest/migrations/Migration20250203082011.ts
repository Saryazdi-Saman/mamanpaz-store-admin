import { Migration } from '@mikro-orm/migrations';

export class Migration20250203082011 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "guest" add column if not exists "address_line2" text null, add column if not exists "address_line3" text null, add column if not exists "province" text null, add column if not exists "postal_code" text null, add column if not exists "country" text null, add column if not exists "neighborhood" text null, add column if not exists "region" text null;');
    this.addSql('alter table if exists "guest" rename column "address" to "address_line1";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "guest" drop column if exists "address_line2";');
    this.addSql('alter table if exists "guest" drop column if exists "address_line3";');
    this.addSql('alter table if exists "guest" drop column if exists "province";');
    this.addSql('alter table if exists "guest" drop column if exists "postal_code";');
    this.addSql('alter table if exists "guest" drop column if exists "country";');
    this.addSql('alter table if exists "guest" drop column if exists "neighborhood";');
    this.addSql('alter table if exists "guest" drop column if exists "region";');
    this.addSql('alter table if exists "guest" rename column "address_line1" to "address";');
  }

}
