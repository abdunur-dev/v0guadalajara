import type { Metadata } from "next";
import LanyardPage from "@/components/lanyard-page";

export const metadata: Metadata = {
  title: "Generate Your Lanyard | v0 IRL Guadalajara",
  description:
    "Create and customize your personalized v0 IRL Guadalajara event lanyard. Choose your color variant and download it as a high-resolution PNG.",
};

export default function Page() {
  return <LanyardPage />;
}
