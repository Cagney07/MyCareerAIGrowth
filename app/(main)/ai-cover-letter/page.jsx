import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="container mx-auto py-8">
      <div className="relative">
        {/* Background design elements */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
        
        {/* Header section with improved styling */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10 relative z-10">
          <div>
            <h1 className="text-6xl font-bold gradient-title mb-2">Cover Letters</h1>
            <p className="text-muted-foreground text-lg">
              Professionally crafted cover letters tailored to your applications
            </p>
          </div>
          <Link href="/ai-cover-letter/new">
            <Button className="shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 border-0">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </Link>
        </div>

        {/* Card with slight shadow for the list */}
        <div className="bg-card rounded-xl shadow-sm p-6">
          <CoverLetterList coverLetters={coverLetters} />
        </div>
      </div>
    </div>
  );
}