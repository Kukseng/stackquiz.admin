import Image from "next/image";
import { cn } from "@/lib/utils";
import { getTopChannels } from "../fetch";

export async function TopChannels({ className }: { className?: string }) {
  const data = await getTopChannels();

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 py-6 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      {/* Title */}
      <h2 className="mb-1 text-body-2xlg font-bold text-dark dark:text-white">
        Top Channels
      </h2>
      <p className="mb-4 text-gray-500 dark:text-gray-400 text-sm">
        Review flagged quizzes and take action
      </p>

      {/* Channel list */}
      <div className="flex flex-col gap-3">
        {data.map((channel, i) => (
          <div
            key={channel.name + i}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer",
              " hover:bg-gray-200",
              "dark:bg-gray-dark dark:hover:bg-gray-600"
            )}
          >
            {/* Avatar */}
            <Image
              src={channel.logo}
              className="size-10 rounded-full object-cover"
              width={40}
              height={40}
              alt={channel.name + " Logo"}
            />

            {/* Channel info */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-dark dark:text-white">
                {channel.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {channel.action ?? "No recent activity"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
