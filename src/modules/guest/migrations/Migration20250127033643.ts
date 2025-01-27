import { Migration } from '@mikro-orm/migrations';

export class Migration20250127033643 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE INDEX IF NOT EXISTS "GUEST_LAST_ACTIVE_AT" ON "guest" (last_active_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop index if exists "GUEST_LAST_ACTIVE_AT";');
  }

}
