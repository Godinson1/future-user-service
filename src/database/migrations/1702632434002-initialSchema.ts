import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1702632434002 implements MigrationInterface {
  name = 'InitialSchema1702632434002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "hashing_algorithm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "algorithm_name" text NOT NULL, CONSTRAINT "PK_c3b4674da9771007be92bc6a2b1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission_description" text NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profile_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "address" text, "next_of_kin_name" text, "next_of_kin_phone_number" text, "next_of_kin_email" text, CONSTRAINT "PK_8a5f5a202bcac1cec58776a12c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role_description" text NOT NULL, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "future_id" text NOT NULL, "first_name" text, "last_name" text, "username" text, "email" text, "phone_number" character varying, "profile_photo" text, "country" text, "gender" text, "type" text DEFAULT 'User', "date_of_birth" text, "active" boolean DEFAULT false, "is_deleted" text DEFAULT false, "roleId" uuid, "detailsId" uuid, CONSTRAINT "UQ_62024e283976cefc277b553b53e" UNIQUE ("future_id"), CONSTRAINT "UQ_3c5b69b9a9a4e3b029e3fef411d" UNIQUE ("email"), CONSTRAINT "UQ_e46595f13e056bf4f152cffcc88" UNIQUE ("phone_number"), CONSTRAINT "REL_fd8189eb034a68b3ca6a546b43" UNIQUE ("detailsId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_login_data_external" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" text NOT NULL, "external_provider_token" text, CONSTRAINT "PK_661eecf8c71be53845c1077c8d6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "granted_permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission_id" text NOT NULL, "role_id" text NOT NULL, "permissionIdId" uuid, "roleIdId" uuid, CONSTRAINT "PK_a6e6aefe4517de454972a16ae6a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_login_data" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "token_generation_time" TIMESTAMP NOT NULL DEFAULT now(), "confirmation_token" text, "password_hash" text, "password_salt" text, "username" text, "email" text, "phone_number" character varying, "email_validation_status_id" text, "password_recovery_token" text, "recovery_token_time" text, "userId" uuid, "hashAlgorithmId" uuid, CONSTRAINT "UQ_62b1399f227911e5e22d505d982" UNIQUE ("email"), CONSTRAINT "UQ_0816ed248ce065b2de39f705e49" UNIQUE ("phone_number"), CONSTRAINT "REL_7d63048c2ec0094d6e19828fee" UNIQUE ("userId"), CONSTRAINT "PK_39b8a51e24435c604e5134659dc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "external_providers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "ws_endpoint" text NOT NULL, "provider_name" text, CONSTRAINT "PK_2a3004dabee1867421a30488279" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_24ae6fd0e87d92677e9fcbd6aa0" FOREIGN KEY ("roleId") REFERENCES "user_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_fd8189eb034a68b3ca6a546b43b" FOREIGN KEY ("detailsId") REFERENCES "user_profile_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "granted_permissions" ADD CONSTRAINT "FK_fa88979b70002f4e1b6383117fb" FOREIGN KEY ("permissionIdId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "granted_permissions" ADD CONSTRAINT "FK_2258cb53f6319a1e01049515cf0" FOREIGN KEY ("roleIdId") REFERENCES "user_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_data" ADD CONSTRAINT "FK_7d63048c2ec0094d6e19828fee7" FOREIGN KEY ("userId") REFERENCES "user_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_data" ADD CONSTRAINT "FK_a024995be2a6207ba6a1dbbe7be" FOREIGN KEY ("hashAlgorithmId") REFERENCES "hashing_algorithm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_login_data" DROP CONSTRAINT "FK_a024995be2a6207ba6a1dbbe7be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_data" DROP CONSTRAINT "FK_7d63048c2ec0094d6e19828fee7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "granted_permissions" DROP CONSTRAINT "FK_2258cb53f6319a1e01049515cf0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "granted_permissions" DROP CONSTRAINT "FK_fa88979b70002f4e1b6383117fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_fd8189eb034a68b3ca6a546b43b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_24ae6fd0e87d92677e9fcbd6aa0"`,
    );
    await queryRunner.query(`DROP TABLE "external_providers"`);
    await queryRunner.query(`DROP TABLE "user_login_data"`);
    await queryRunner.query(`DROP TABLE "granted_permissions"`);
    await queryRunner.query(`DROP TABLE "user_login_data_external"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "user_profile_details"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "hashing_algorithm"`);
  }
}
