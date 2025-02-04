import { Migration } from '@mikro-orm/migrations';

export class Migration20250204084129 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "qr-link" rename column "code" to "link";');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_qr-link_link_unique" ON "qr-link" (link) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "IDX_qr-link_link_unique";');
    this.addSql('alter table if exists "qr-link" rename column "link" to "code";');
  }

}
