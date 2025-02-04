import { Migration } from '@mikro-orm/migrations';

export class Migration20250204092332 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "visit" rename column "referrer" to "referer";');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "visit" rename column "referer" to "referrer";');
  }

}
