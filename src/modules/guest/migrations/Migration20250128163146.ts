import { Migration } from '@mikro-orm/migrations';

export class Migration20250128163146 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "guest" add column if not exists "phone_verification_code" text null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "guest" drop column if exists "phone_verification_code";');
  }

}
