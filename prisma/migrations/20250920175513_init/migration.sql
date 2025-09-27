-- CreateEnum
CREATE TYPE "public"."user_provider" AS ENUM ('none', 'facebook', 'google');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('customer', 'location_admin', 'website_admin');

-- CreateEnum
CREATE TYPE "public"."user_status" AS ENUM ('pending', 'active', 'banned');

-- CreateEnum
CREATE TYPE "public"."venue_category" AS ENUM ('wedding', 'party', 'conference', 'exhibition', 'sports', 'cultural');

-- CreateEnum
CREATE TYPE "public"."review_status" AS ENUM ('active', 'banned');

-- CreateEnum
CREATE TYPE "public"."event_status_enum" AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "public"."payment_method_enum" AS ENUM ('dahabia', 'ccp', 'bank_transfer', 'cash');

-- CreateEnum
CREATE TYPE "public"."payment_status_enum" AS ENUM ('pending', 'paid', 'refunded');

-- CreateEnum
CREATE TYPE "public"."complaint_status" AS ENUM ('sent', 'open_in', 'in_progress');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "role" "public"."user_role" DEFAULT 'customer',
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(100) NOT NULL,
    "date_of_birth" DATE,
    "address" VARCHAR(100),
    "state" VARCHAR(100),
    "district" VARCHAR(100),
    "municipality" VARCHAR(100),
    "preferences" JSONB,
    "status" "public"."user_status" DEFAULT 'pending',
    "password" VARCHAR(200),
    "avatar" VARCHAR(200),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "refresh_token" VARCHAR(200),
    "oauth_provider" "public"."user_provider" DEFAULT 'none',
    "oauth_id" VARCHAR(200),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."venues" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "category" "public"."venue_category" DEFAULT 'wedding',
    "address" VARCHAR(100) NOT NULL,
    "state" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100) NOT NULL,
    "municipality" VARCHAR(100) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "amenities" JSONB,
    "is_active" BOOLEAN DEFAULT false,
    "is_available" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "admin_id" INTEGER NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" SERIAL NOT NULL,
    "image_url" VARCHAR(200) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "is_cover" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "venue_id" INTEGER,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "status" "public"."review_status" DEFAULT 'active',
    "image" VARCHAR(200),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "customer_id" INTEGER,
    "venue_id" INTEGER,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookings" (
    "id" SERIAL NOT NULL,
    "event_date" DATE NOT NULL,
    "attendances" INTEGER NOT NULL,
    "payment_status" "public"."payment_status_enum" NOT NULL,
    "payment_method" "public"."payment_method_enum" NOT NULL,
    "status" "public"."event_status_enum" NOT NULL,
    "notes" TEXT,
    "check_in_at" TIME(6),
    "check_out_at" TIME(6),
    "canceled" BOOLEAN DEFAULT false,
    "cancelation_reason" TEXT,
    "created_at" DATE DEFAULT CURRENT_DATE,
    "updated_at" DATE DEFAULT CURRENT_DATE,
    "customer_id" INTEGER,
    "venue_id" INTEGER,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."complaints" (
    "id" SERIAL NOT NULL,
    "subject" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "status" "public"."complaint_status" DEFAULT 'sent',
    "created_at" DATE DEFAULT CURRENT_DATE,
    "customer_id" INTEGER,
    "location_id" INTEGER,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."feedbacks" (
    "name" VARCHAR(200),
    "email" VARCHAR(200),
    "message" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."venue_visits" (
    "id" SERIAL NOT NULL,
    "venue_id" INTEGER NOT NULL,
    "visited_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venue_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "venues_admin_id_key" ON "public"."venues"("admin_id");

-- AddForeignKey
ALTER TABLE "public"."venues" ADD CONSTRAINT "venues_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "reviews_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_customer" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bookings" ADD CONSTRAINT "fk_venue" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "fk_customer" FOREIGN KEY ("customer_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."complaints" ADD CONSTRAINT "fk_location" FOREIGN KEY ("location_id") REFERENCES "public"."venues"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."venue_visits" ADD CONSTRAINT "venue_visits_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
