-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `section_configs` (
    `id` CHAR(36) NOT NULL,
    `section_name` VARCHAR(64) NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `title` VARCHAR(191) NULL,

    UNIQUE INDEX `section_configs_section_name_key`(`section_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` CHAR(36) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `content_markdown` TEXT NOT NULL,
    `cloudinary_image_url` VARCHAR(1024) NOT NULL,
    `github_url` VARCHAR(1024) NULL,
    `live_url` VARCHAR(1024) NULL,
    `category` VARCHAR(64) NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,
    `order_index` INTEGER NOT NULL DEFAULT 0,

    INDEX `projects_is_visible_order_index_idx`(`is_visible`, `order_index`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skills` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `is_visible` BOOLEAN NOT NULL DEFAULT true,

    INDEX `skills_is_visible_idx`(`is_visible`),
    UNIQUE INDEX `skills_name_category_key`(`name`, `category`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
