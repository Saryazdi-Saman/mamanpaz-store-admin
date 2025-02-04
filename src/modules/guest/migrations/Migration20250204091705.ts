import { Migration } from '@mikro-orm/migrations';

export class Migration20250204091705 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "visit" add column if not exists "origin" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "visit" drop column if exists "origin";');
  }

}
