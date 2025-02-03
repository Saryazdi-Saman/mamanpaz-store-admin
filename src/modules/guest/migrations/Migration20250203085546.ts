import { Migration } from '@mikro-orm/migrations';

export class Migration20250203085546 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "guest" add column if not exists "district" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "guest" drop column if exists "district";');
  }

}
