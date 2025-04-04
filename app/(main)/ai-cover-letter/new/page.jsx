import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterGenerator from "../_components/cover-letter-generator";

export default function NewCoverLetterPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="relative">
        {/* Background design elements */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
        
        <div className="flex flex-col space-y-4 relative z-10">
          <Link href="/ai-cover-letter">
            <Button variant="outline" className="gap-2 pl-2 border border-gray-200 shadow-sm hover:shadow-md transition-all w-fit">
              <ArrowLeft className="h-4 w-4" />
              Back to Cover Letters
            </Button>
          </Link>

          <div className="pb-6">
            <div className="inline-block backdrop-blur-sm bg-background/80 p-2 px-4 rounded-full text-xs font-medium text-muted-foreground mb-2">
              AI-Powered
            </div>
            <h1 className="text-5xl font-bold gradient-title mb-2">
              Create Cover Letter
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Generate a tailored cover letter for your job application using our advanced AI technology
            </p>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-gray-100">
          <CoverLetterGenerator />
        </div>
      </div>
    </div>
  );
}