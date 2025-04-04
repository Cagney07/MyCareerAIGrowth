"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Building, Briefcase, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  // Update content when letter is generated
  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      router.push(`/ai-cover-letter/${generatedLetter.id}`);
      reset();
    }
  }, [generatedLetter]);

  const onSubmit = async (data) => {
    try {
      await generateLetterFn(data);
    } catch (error) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Provide information about the position you're applying for
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          <form id="cover-letter-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="companyName" className="text-sm font-medium flex items-center space-x-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>Company Name</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  className="border-gray-200 focus:border-blue-500 shadow-sm"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="jobTitle" className="text-sm font-medium flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>Job Title</span>
                </Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter job title"
                  className="border-gray-200 focus:border-blue-500 shadow-sm"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="jobDescription" className="text-sm font-medium flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Job Description</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the job description here"
                className="min-h-32 border-gray-200 focus:border-blue-500 shadow-sm"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="px-6 flex justify-end">
          <Button 
            type="submit" 
            form="cover-letter-form"
            disabled={generating}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}