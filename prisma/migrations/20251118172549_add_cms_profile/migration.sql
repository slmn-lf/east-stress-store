-- CreateTable
CREATE TABLE "cms_profiles" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "heroTitle" TEXT NOT NULL DEFAULT '',
    "heroSubtitle" TEXT NOT NULL DEFAULT '',
    "heroCta" TEXT NOT NULL DEFAULT '',
    "heroImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "about" TEXT NOT NULL DEFAULT '{}',
    "contact" TEXT NOT NULL DEFAULT '{}',
    "recommendedProducts" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cms_profiles_pkey" PRIMARY KEY ("id")
);
