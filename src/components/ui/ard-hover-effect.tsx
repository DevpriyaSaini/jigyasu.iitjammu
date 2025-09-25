import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
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
    email:string;
    description?: string;
    title?: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
  className={cn(
     "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 dark -ml-12 -mr-10",
    className
  )}
>
  {items.map((item, idx) => (
    <div
      key={item.id || idx}
      className="relative group block p-2 h-full w-full"
      onMouseEnter={() => setHoveredIndex(idx)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === idx && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/80 block rounded-3xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>

      <Card className="h-full w-full flex flex-col">
        {/* Image */}
         <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden rounded-t-xl">
 <CldImage
  src={item.image as string} // ✅ type assertion
  width={800}
  height={500}
  alt="Alumni Image"
  className="h-full w-full object-cover rounded-t-xl"
/>
</div>

        {/* Title & Description */}
        {item.title && <CardTitle>{item.title}</CardTitle>}
        {item.description && (
          <CardDescription>{item.description}</CardDescription>
        )}

        {/* Extra details */}
        <div className="mt-4 text-sm text-zinc-300 space-y-1 flex-grow">
          {item.projectname && (
            <p>
              <span className="font-semibold">Project:</span>{" "}
              {item.projectname}
            </p>
          )}
          {item.postedby && (
            <p>
              <span className="font-semibold">Posted by:</span>{" "}
              {item.postedby}
            </p>
          )}
          {item.deadline && (
            <p>
              <span className="font-semibold">Deadline:</span>{" "}
              {item.deadline}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-9">
          <a
            href={`/project/${item.id}`}
            className="px-4 py-2 rounded-xl bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition"
          >
            View More
          </a>
          <Link
            href={`/applyjob?projectname=${item.title}&profemail=${item.email}`}
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
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

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/20 group-hover:border-slate-700 relative z-20 flex flex-col justify-between",
        className
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-2", className)}>
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
