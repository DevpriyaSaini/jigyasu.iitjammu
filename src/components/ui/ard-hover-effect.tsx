"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    id: string;
    image?: string;
    postedby?: string;
    projectname?: string;
    deadline?: string;
    email: string;
    projectId:string;
    description?: string;
    title?: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.id || idx}
          className="relative block p-2 h-full w-full lg:col-span-2 xl:col-span-1 gap-5"
        >
          <Card className="h-full w-80  flex flex-col transition-colors duration-300">
            {/* Image */}
            <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-t-xl">
              <CldImage
                src={item.image as string}
                width={800}
                height={500}
                alt="Alumni Image"
                className="h-full w-full object-cover rounded-t-xl"
              />
            </div>

            {/* Title & Description */}
            {item.title && <CardTitle>{item.title}</CardTitle>}
            {item.description && <CardDescription>{item.description}</CardDescription>}

            {/* Extra details */}
            <div className="mt-4 text-sm space-y-1 flex-grow text-gray-700 dark:text-gray-300">
              {item.projectname && (
                <p>
                  <span className="font-semibold">Project:</span> {item.projectname}
                </p>
              )}
              {item.postedby && (
                <p>
                  <span className="font-semibold">Posted by:</span> {item.postedby}
                </p>
              )}
              {item.deadline && (
                <p>
                  <span className="font-semibold">Deadline:</span> {item.deadline}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <a
                href={`/project/${item.id}`}
                className="px-4 py-2 rounded-xl bg-gray-800 text-white text-sm font-medium dark:bg-gray-200 dark:text-black transition-colors duration-300"
              >
                View More
              </a>
              <Link
                href={`/applyjob?projectname=${item.title}&profemail=${item.email} &projectId=${item.projectId}`}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium dark:bg-blue-400 dark:text-black transition-colors duration-300"
              >
                Apply Now
              </Link>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

// Card Component
export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={cn(
      "rounded-2xl h-full w-full p-4 overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col justify-between transition-colors duration-300",
      className
    )}
  >
    <div className="relative z-50">{children}</div>
  </div>
);

// Card Title
export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <h4 className={cn("text-gray-900 dark:text-gray-100 font-bold tracking-wide mt-2 text-lg", className)}>
    {children}
  </h4>
);

// Card Description
export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={cn("mt-2 text-gray-700 dark:text-gray-300 tracking-wide leading-relaxed text-sm", className)}>
    {children}
  </p>
);
