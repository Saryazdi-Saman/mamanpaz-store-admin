import { Migration } from '@mikro-orm/migrations';

export class Migration20250203081731 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "guest" add column if not exists "address" text null, add column if not exists "city" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "guest" drop column if exists "address";');
    this.addSql('alter table if exists "guest" drop column if exists "city";');
  }

}
