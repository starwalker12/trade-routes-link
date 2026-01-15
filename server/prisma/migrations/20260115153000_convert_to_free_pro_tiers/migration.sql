-- AlterEnum: Change Plan enum from (STARTER, GROWTH, PRO) to (FREE, PRO)

-- Step 1: Create a new enum type with FREE and PRO
CREATE TYPE "Plan_new" AS ENUM ('FREE', 'PRO');

-- Step 2: Add a temporary column with the new enum type
ALTER TABLE "Subscription" ADD COLUMN "plan_new" "Plan_new";

-- Step 3: Migrate data: STARTER and GROWTH → FREE, PRO → PRO
UPDATE "Subscription"
SET "plan_new" = CASE 
  WHEN plan = 'PRO' THEN 'PRO'::"Plan_new"
  ELSE 'FREE'::"Plan_new"
END;

-- Step 4: Drop the old column
ALTER TABLE "Subscription" DROP COLUMN "plan";

-- Step 5: Rename the new column
ALTER TABLE "Subscription" RENAME COLUMN "plan_new" TO "plan";

-- Step 6: Set NOT NULL and DEFAULT
ALTER TABLE "Subscription" ALTER COLUMN "plan" SET NOT NULL;
ALTER TABLE "Subscription" ALTER COLUMN "plan" SET DEFAULT 'FREE';

-- Step 7: Drop the old enum type
DROP TYPE "Plan";

-- Step 8: Rename the new enum type
ALTER TYPE "Plan_new" RENAME TO "Plan";
