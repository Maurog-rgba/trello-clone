import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { db } from "@/lib/db";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org")
  }

  const boards = await db.board.findMany({
    where: {
      orgId: orgId
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board: any) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm w-full h-full p-2 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative semi-bold text-white">
              {board.title}
            </p>
          </Link>
        ))}
        <FormPopover sideOffset={10} side="right">
          <div role="button" className="aspect-video relative  h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
            <p className="text-sm">
              Create new board
            </p>
            <span className="text-xs">
              {isPro ? "Unlimited boards" : `${MAX_FREE_BOARDS - availableCount} boards left`}
            </span>
            <Hint sideOffset={40} description={`Free workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.`}>
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video p-2 w-full h-full" />
      <Skeleton className="aspect-video p-2 w-full h-full" />
      <Skeleton className="aspect-video p-2 w-full h-full" />
      <Skeleton className="aspect-video p-2 w-full h-full" />
      <Skeleton className="aspect-video p-2 w-full h-full" />
      <Skeleton className="aspect-video p-2 w-full h-full" />
      <Skeleton className="aspect-video p-2 w-full h-full" />
    </div>
  );
};