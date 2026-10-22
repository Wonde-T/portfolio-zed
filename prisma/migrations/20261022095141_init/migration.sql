-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "password_hash" VARCHAR(191) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "section_configs" (
    "id" UUID NOT NULL,
    "section_name" VARCHAR(64) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "title" VARCHAR(191),

    CONSTRAINT "section_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "title" VARCHAR(191) NOT NULL,
    "description" TEXT NOT NULL,
    "content_markdown" TEXT NOT NULL,
    "cloudinary_image_url" VARCHAR(1024) NOT NULL,
    "github_url" VARCHAR(1024),
    "live_url" VARCHAR(1024),
    "category" VARCHAR(64) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "order_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "category" VARCHAR(64) NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_content" (
    "id" UUID NOT NULL,
    "greeting" VARCHAR(191) NOT NULL,
    "name" VARCHAR(191) NOT NULL,
    "role" VARCHAR(191) NOT NULL,
    "bio" TEXT NOT NULL,
    "availability" VARCHAR(191) NOT NULL,
    "location" VARCHAR(191) NOT NULL,
    "email" VARCHAR(191) NOT NULL,
    "photo_url" VARCHAR(1024),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "section_configs_section_name_key" ON "section_configs"("section_name");

-- CreateIndex
CREATE INDEX "projects_is_visible_order_index_idx" ON "projects"("is_visible", "order_index");

-- CreateIndex
CREATE INDEX "skills_is_visible_idx" ON "skills"("is_visible");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_category_key" ON "skills"("name", "category");
