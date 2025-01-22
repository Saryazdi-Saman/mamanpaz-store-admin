import { Migration } from '@mikro-orm/migrations';

export class Migration20250122032536 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "guest" ("id" text not null, "phone_number" text null, "phone_verified" boolean not null default false, "email" text null, "password" text null, "name" text null, "last_name" text null, "address" text null, "city" text null, "expires_at" timestamptz not null, "token" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "guest_pkey" primary key ("id"));');
    this.addSql('CREATE UNIQUE INDEX IF NOT EXISTS "IDX_guest_token_unique" ON "guest" (token) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "GUEST_TOKEN" ON "guest" (token) WHERE deleted_at IS NULL;');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_guest_deleted_at" ON "guest" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "guest" cascade;');
  }

}
