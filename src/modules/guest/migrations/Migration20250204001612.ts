import { Migration } from '@mikro-orm/migrations';

export class Migration20250204001612 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "utm_source" rename column "campaign" to "campaign_name";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "utm_source" rename column "campaign_name" to "campaign";');
  }

}
