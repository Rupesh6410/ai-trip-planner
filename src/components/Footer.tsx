import { FaGithub, FaGlobe, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t py-6 mt-12 bg-white dark:bg-black/10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} AI Trip Planner. All rights reserved.
        </div>

        <div className="flex items-center space-x-4">
          <Link
            href="https://github.com/Rupesh6410/ai-trip-planner"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-blue-600 transition"
          >
            <FaGithub className="w-5 h-5" />
          </Link>
          <Link
            href="mailto:rupesh6410@gmail.com"
            className="text-muted-foreground hover:text-blue-600 transition"
          >
            <FaEnvelope className="w-5 h-5" />
          </Link>
          <Link
            href="/"
            className="text-muted-foreground hover:text-blue-600 transition"
          >
            <FaGlobe className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
