"use server";

import { db } from "@/lib/prisma";
import { auth} from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export async function saveResume(content) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
  
    try {
      const resume = await db.resume.upsert({
        where: {
          userId: user.id,
        },
        update: {
          content,
        },
        create: {
          userId: user.id,
          content,
        },
      });
  
      revalidatePath("/resume");
      return resume;
    } catch (error) {
      console.error("Error saving resume:", error);
      throw new Error("Failed to save resume");
    }
}

export async function getResume() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) throw new Error("User not found");
  
    return await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });
  }

  export async function improveWithAI({ current, type }) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });
  
    if (!user) throw new Error("User not found");
  
    const prompt = `
      As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
      Make it more impactful, quantifiable, and aligned with industry standards.Give in ATS freidnely manner also.
      Current content: "${current}"
  
      Requirements:
      1. Use action verbs
      2. Include metrics and results where possible
      3. Highlight relevant technical skills
      4. Keep it concise but detailed
      5. Focus on achievements over responsibilities
      6. Use industry-specific keywords
      7. Make it ATS-friendly
      
      Format the response as a single paragraph without any additional text or explanations.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const improvedContent = response.text().trim();
        return improvedContent;
      } catch (error) {
        console.error("Error improving content:", error);
        throw new Error("Failed to improve content");
      }

}

export async function saveResumeData({ resumeData }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    // Convert the resumeData object to a JSON string
    const serializedData = JSON.stringify(resumeData);

    // Save both the raw data and human-readable content
    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        formData: serializedData,
        // Create a human-readable version for display purposes
        content: generateHumanReadableContent(resumeData),
      },
      create: {
        userId: user.id,
        formData: serializedData,
        content: generateHumanReadableContent(resumeData),
      },
    });

    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume data:", error);
    throw new Error("Failed to save resume data");
  }
}

// Helper function to generate human-readable content from resume data
function generateHumanReadableContent(data) {
  let content = "";
  
  // Add personal information
  if (data.personalInfo) {
    const { fullName, jobTitle, email, phone, location, website, summary } = data.personalInfo;
    content += `# ${fullName || ""}${jobTitle ? ` - ${jobTitle}` : ""}\n\n`;
    
    const contactDetails = [];
    if (email) contactDetails.push(`Email: ${email}`);
    if (phone) contactDetails.push(`Phone: ${phone}`);
    if (location) contactDetails.push(`Location: ${location}`);
    if (website) contactDetails.push(`LinkedIn: ${website}`);
    
    if (contactDetails.length > 0) {
      content += contactDetails.join(" | ") + "\n\n";
    }
    
    if (summary) {
      content += `## Summary\n${summary}\n\n`;
    }
  }
  
  // Add skills
  if (data.skills) {
    content += `## Skills\n${data.skills}\n\n`;
  }
  
  // Add experience
  if (data.experience && data.experience.length > 0) {
    content += `## Work Experience\n\n`;
    data.experience.forEach(exp => {
      if (exp.jobTitle || exp.company) {
        content += `### ${exp.jobTitle || ""} at ${exp.company || ""}\n`;
        if (exp.duration) content += `${exp.duration}\n\n`;
        if (exp.description) content += `${exp.description}\n\n`;
      }
    });
  }
  
  // Add education
  if (data.education && data.education.length > 0) {
    content += `## Education\n\n`;
    data.education.forEach(edu => {
      if (edu.degree || edu.institution) {
        content += `### ${edu.degree || ""} - ${edu.institution || ""}\n`;
        if (edu.graduation) content += `${edu.graduation}\n\n`;
        if (edu.description) content += `${edu.description}\n\n`;
      }
    });
  }
  
  return content;
}