import { HoverEffect } from "./ui/ard-hover-effect";


export function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    id:"1234",
    title: "Stripe",
    description: "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
    image: "https://imgs.search.brave.com/nlLvFZ4KHos2dFzjmzFVtbDpCgg1z0Xd8aNeAU2RcU4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTQ4/MzkyOTA4L3Bob3Rv/L2RvZy1vbi10aGUt/cGhvbmUuanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPThNUEdR/NmhFMDV4eDh1VzNs/N3RER3N5NGtqSzlL/LW5ZanRfV0hHN3Zu/aW89", // replace with real image
    postedby: "John Doe",
    projectname: "Payment Gateway",
    deadline: "2025-10-15",
  },
  {
    id:"12345",
    title: "Netflix",
    description: "A streaming service that offers movies, TV shows, and more.",
    link: "https://netflix.com",
    image: "https://via.placeholder.com/400x200",
    postedby: "Jane Smith",
    projectname: "Streaming Platform",
    deadline: "2025-11-01",
  },
  {
    id:"12349",
    title: "Netflix",
    description: "A streaming service that offers movies, TV shows, and more.",
    link: "https://netflix.com",
    image: "https://via.placeholder.com/400x200",
    postedby: "Jane Smith",
    projectname: "Streaming Platform",
    deadline: "2025-11-01",
  },
  {
    id:"12347",
    title: "Netflix",
    description: "A streaming service that offers movies, TV shows, and more.",
    link: "https://netflix.com",
    image: "https://via.placeholder.com/400x200",
    postedby: "Jane Smith",
    projectname: "Streaming Platform",
    deadline: "2025-11-01",
  },
];
;
