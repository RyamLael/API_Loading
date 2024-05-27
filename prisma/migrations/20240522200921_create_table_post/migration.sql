-- CreateTable
CREATE TABLE "post" (
    "UUID" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(1000) NOT NULL,
    "post_type" VARCHAR(30) NOT NULL,
    "image_url" VARCHAR(255),
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("UUID")
);
