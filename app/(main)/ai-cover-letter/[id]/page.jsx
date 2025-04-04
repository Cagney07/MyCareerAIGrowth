import Link from "next/link";
import { ArrowLeft, Download, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";

export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <div className="container mx-auto py-8">
      <div className="relative">
        {/* Background design elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl opacity-50"></div>
        
        <div className="flex flex-col space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <Link href="/ai-cover-letter">
              <Button variant="outline" className="gap-2 pl-2 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <ArrowLeft className="h-4 w-4" />
                Back to Cover Letters
              </Button>
            </Link>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="gap-2 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </Button>
              <Button variant="outline" className="gap-2 border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>

          <div className="mb-2">
            <div className="inline-block backdrop-blur-sm bg-background/80 p-2 px-4 rounded-full text-xs font-medium text-muted-foreground mb-2">
              Cover Letter
            </div>
            <h1 className="text-5xl font-bold gradient-title">
              {coverLetter?.jobTitle} at {coverLetter?.companyName}
            </h1>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <CoverLetterPreview content={coverLetter?.content} />
        </div>
      </div>
    </div>
  );
}