"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Edit2, Eye, Trash2, Briefcase, Building } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";
import { Badge } from "@/components/ui/badge";

export default function CoverLetterList({ coverLetters }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-lg transition-all">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">No Cover Letters Yet</CardTitle>
          <CardDescription className="text-lg">
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Briefcase className="h-10 w-10 text-primary/60" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {coverLetters.map((letter) => (
        <Card 
          key={letter.id} 
          className="group relative overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all bg-background/50 backdrop-blur-sm"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          
          <CardHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs font-normal">
                    {letter.companyName}
                  </Badge>
                </div>
                <CardTitle className="text-xl gradient-title">
                  {letter.jobTitle}
                </CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Created {format(new Date(letter.createdAt), "PPP")}
                </CardDescription>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-70 hover:opacity-100 hover:bg-blue-500/10 transition-all"
                  onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-70 hover:opacity-100 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border border-gray-100 shadow-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-muted-foreground text-sm line-clamp-3 bg-card/50 p-3 rounded-md">
              {letter.jobDescription}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}