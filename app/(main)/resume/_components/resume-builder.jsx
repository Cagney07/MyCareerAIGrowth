"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Download, Save, Sparkles, Loader2, Link as LinkIcon, FileText, Briefcase, GraduationCap, Code } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import Link from "next/link";

const SimpleResumeBuilder = () => {
  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      jobTitle: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      summary: "",
    },
    experience: [
      { jobTitle: "", company: "", duration: "", description: "" }
    ],
    education: [
      { degree: "", institution: "", graduation: "", description: "" }
    ],
    skills: "",
    expDescription: ""
  });

  const [showPreview, setShowPreview] = useState(false);
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const [activeSection, setActiveSection] = useState("personal");

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Handle AI improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      if (activeExpIndex !== null) {
        handleExperienceChange(activeExpIndex, 'description', improvedContent);
      }
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving]);

  const handleImproveDescription = async (index, type = "experience") => {
    const description = formData.experience[index].description;
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    setActiveExpIndex(index);
    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  // Handle input changes for personal info
  const handlePersonalInfoChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [id]: value
      }
    });
  };

  // Handle input changes for experience
  const handleExperienceChange = (index, field, value) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  // Handle input changes for education
  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        { jobTitle: "", company: "", duration: "", description: "" }
      ]
    });
  };

  // Remove experience entry
  const removeExperience = (index) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  // Add new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { degree: "", institution: "", graduation: "", description: "" }
      ]
    });
  };

  // Remove education entry
  const removeEducation = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Handle text area changes
  const handleTextAreaChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
  };

  // Format experience description with bullet points
  const formatDescription = (text) => {
    if (!text) return "";
    
    const formattedText = text.split('\n').map(line => {
      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return `<li>${line.trim().substring(1).trim()}</li>`;
      }
      return `<p>${line}</p>`;
    }).join('');
    
    if (formattedText.includes('<li>')) {
      return `<ul className="list-disc pl-5 space-y-1">${formattedText}</ul>`;
    }
    
    return formattedText;
  };

  // Validate LinkedIn URL
  const validateLinkedIn = (url) => {
    if (!url) return true;
    try {
      const parsed = new URL(url);
      return parsed.hostname.includes('linkedin.com');
    } catch {
      return false;
    }
  };

  // Trigger browser print for PDF download
  const handleDownload = () => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page {
          size: auto;
          margin: 0mm;
        }
        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        body * {
          visibility: hidden;
        }
        .resume-preview, .resume-preview * {
          visibility: visible;
        }
        .resume-preview {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 40px;
          box-sizing: border-box;
          background-color: white;
          color: #000 !important;
          margin: 0;
        }
        .no-print {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  const SectionNav = () => (
    <div className="flex justify-center mb-8 print:hidden overflow-x-auto">
      <div className="bg-gray-100 rounded-xl p-1 flex space-x-1">
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${activeSection === "personal" 
            ? "bg-white text-blue-600 shadow-md font-medium" 
            : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setActiveSection("personal")}
        >
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Personal
          </div>
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${activeSection === "experience" 
            ? "bg-white text-blue-600 shadow-md font-medium" 
            : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setActiveSection("experience")}
        >
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Experience
          </div>
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${activeSection === "education" 
            ? "bg-white text-blue-600 shadow-md font-medium" 
            : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setActiveSection("education")}
        >
          <div className="flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Education
          </div>
        </button>
        <button 
          className={`px-4 py-2 rounded-lg transition-all ${activeSection === "skills" 
            ? "bg-white text-blue-600 shadow-md font-medium" 
            : "text-gray-600 hover:bg-gray-200"}`}
          onClick={() => setActiveSection("skills")}
        >
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-2" />
            Skills
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-8 print:py-0">
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500">Resume Builder</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Create your professional resume in minutes</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowPreview(true)} 
              className="no-print bg-purple-600 hover:bg-purple-700 text-white"
            >
              Preview Resume
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownload} 
              className="no-print border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        
        {/* Form Section */}
        <div className={`space-y-8 ${showPreview ? 'print:hidden hidden' : 'block'}`}>
          <SectionNav />
          
          {/* Personal Information */}
          {activeSection === "personal" && (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name *</label>
                    <Input 
                      id="fullName" 
                      value={formData.personalInfo.fullName}
                      onChange={handlePersonalInfoChange}
                      placeholder="John Doe" 
                      required 
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="text-sm font-medium text-gray-700 dark:text-gray-300">Professional Title</label>
                    <Input 
                      id="jobTitle" 
                      value={formData.personalInfo.jobTitle}
                      onChange={handlePersonalInfoChange}
                      placeholder="Software Engineer" 
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address *</label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.personalInfo.email}
                      onChange={handlePersonalInfoChange}
                      placeholder="john.doe@example.com" 
                      required 
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number *</label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      value={formData.personalInfo.phone}
                      onChange={handlePersonalInfoChange}
                      placeholder="(123) 456-7890" 
                      required 
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                    <Input 
                      id="location" 
                      value={formData.personalInfo.location}
                      onChange={handlePersonalInfoChange}
                      placeholder="New York, NY" 
                      className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn Profile</label>
                    <div className="relative">
                      <Input 
                        id="website" 
                        type="url" 
                        value={formData.personalInfo.website}
                        onChange={handlePersonalInfoChange}
                        placeholder="https://linkedin.com/in/your-profile" 
                        className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pl-10"
                      />
                      <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                    {!validateLinkedIn(formData.personalInfo.website) && formData.personalInfo.website && (
                      <p className="text-sm text-red-500">Please enter a valid LinkedIn URL</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="summary" className="text-sm font-medium text-gray-700 dark:text-gray-300">Professional Summary</label>
                  <Textarea 
                    id="summary" 
                    value={formData.personalInfo.summary}
                    onChange={handlePersonalInfoChange}
                    placeholder="Brief overview of your professional background and key strengths" 
                    className="h-32 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Work Experience */}
          {activeSection === "experience" && (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                        <Input 
                          value={exp.jobTitle}
                          onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                          placeholder="Software Engineer" 
                          className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Company</label>
                        <Input 
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                          placeholder="Tech Company Inc." 
                          className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</label>
                        <Input 
                          value={exp.duration}
                          onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                          placeholder="Jan 2020 - Present" 
                          className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                        placeholder="Describe your responsibilities and achievements"
                        className="h-32 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImproveDescription(index, "experience")}
                        disabled={isImproving || !exp.description}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 flex items-center mt-2"
                      >
                        {isImproving && activeExpIndex === index ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Improving...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Improve with AI
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {formData.experience.length > 1 && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeExperience(index)}
                        className="no-print mt-2"
                      >
                        Remove Entry
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addExperience}
                  className="no-print bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                >
                  + Add Experience
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Education */}
          {activeSection === "education" && (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {formData.education.map((edu, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Degree</label>
                        <Input 
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          placeholder="Bachelor of Science in Computer Science" 
                          className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Institution</label>
                        <Input 
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          placeholder="University Name" 
                          className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Graduation Year</label>
                        <Input 
                          value={edu.graduation}
                          onChange={(e) => handleEducationChange(index, 'graduation', e.target.value)}
                          placeholder="2020" 
                          className="border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                      <Textarea
                        value={edu.description}
                        onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                        placeholder="Describe your education, achievements, or relevant coursework"
                        className="h-32 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleImproveDescription(index, "education")}
                        disabled={isImproving || !edu.description}
                        className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 flex items-center mt-2"
                      >
                        {isImproving && activeExpIndex === index ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Improving...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Improve with AI
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {formData.education.length > 1 && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => removeEducation(index)}
                        className="no-print mt-2"
                      >
                        Remove Entry
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addEducation}
                  className="no-print bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                >
                  + Add Education
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Skills */}
          {activeSection === "skills" && (
            <Card className="shadow-lg border-none bg-white dark:bg-gray-800">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Skills</label>
                  <Textarea 
                    id="skills" 
                    value={formData.skills}
                    onChange={handleTextAreaChange}
                    placeholder="List your skills separated by commas (e.g., JavaScript, React, Node.js, Project Management)" 
                    className="h-32 border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Preview:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.split(',').map((skill, index) => (
                      skill.trim() ? (
                        <span 
                          key={index} 
                          className="bg-purple-50 text-purple-700 px-3 py-1 rounded-md text-sm dark:bg-purple-900 dark:text-purple-100"
                        >
                          {skill.trim()}
                        </span>
                      ) : null
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="flex justify-between no-print">
            <Button onClick={() => setShowPreview(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
              Preview Resume
            </Button>
            <Button variant="outline" onClick={handleDownload} className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className={`${showPreview ? 'block' : 'hidden'} print:block`}>
          <div className="flex justify-between mb-6 print:hidden no-print">
            <Button onClick={() => setShowPreview(false)} className="bg-purple-600 hover:bg-purple-700 text-white">
              Back to Edit
            </Button>
            <Button variant="outline" onClick={handleDownload} className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
          
          <div className="resume-preview bg-white border rounded-lg p-8 shadow-lg mb-8 print:shadow-none print:border-0 print:p-0 text-black">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-1 text-purple-800 print:text-black">
                {formData.personalInfo.fullName || "Your Name"}
              </h1>
              <div className="text-sm text-gray-600 space-x-2 print:text-black flex items-center justify-center flex-wrap">
                {formData.personalInfo.email && (
                  <span className="flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700 my-1 mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {formData.personalInfo.email}
                  </span>
                )}
                {formData.personalInfo.phone && (
                  <span className="flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700 my-1 mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {formData.personalInfo.phone}
                  </span>
                )}
                {formData.personalInfo.location && (
                  <span className="flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700 my-1 mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {formData.personalInfo.location}
                  </span>
                )}
                {formData.personalInfo.website && (
                  <span className="flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700 my-1 mx-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <Link 
                      href={formData.personalInfo.website.startsWith('http') ? 
                        formData.personalInfo.website : 
                        `https://${formData.personalInfo.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline print:text-black"
                    >
                      LinkedIn
                    </Link>
                  </span>
                )}
              </div>
            </div>
            
            {formData.personalInfo.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b-2 border-violet-400 pb-2 mb-3 text-violet-800 print:text-black print:border-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Professional Summary
                </h2>
                <p className="text-gray-800 whitespace-pre-line print:text-black leading-relaxed pl-2 border-l-4 border-violet-100 py-2">{formData.personalInfo.summary}</p>
              </div>
            )}
            
            {formData.experience.some(exp => exp.jobTitle || exp.company) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b-2 border-violet-400 pb-2 mb-3 text-violet-800 print:text-black print:border-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  Work Experience
                </h2>
                {formData.experience.map((exp, index) => (
                  (exp.jobTitle || exp.company) && (
                    <div key={index} className="mb-6 hover:bg-purple-50 p-3 rounded-lg transition-colors duration-200">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 print:text-black">{exp.jobTitle}</h3>
                          <p className="text-purple-600 font-medium print:text-black">{exp.company}</p>
                        </div>
                        <p className="text-gray-600 italic whitespace-nowrap print:text-black bg-gray-100 px-2 py-1 rounded-md text-sm">
                          {exp.duration}
                        </p>
                      </div>
                      {exp.description && (
                        <div 
                          className="mt-2 text-black pl-4 border-l-2 border-violet-200"
                          dangerouslySetInnerHTML={{ __html: formatDescription(exp.description) }} 
                        />
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
            
            {formData.education.some(edu => edu.degree || edu.institution) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b-2 border-violet-400 pb-2 mb-3 text-violet-800 print:text-black print:border-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  Education
                </h2>
                {formData.education.map((edu, index) => (
                  (edu.degree || edu.institution) && (
                    <div key={index} className="mb-4 hover:bg-purple-50 p-3 rounded-lg transition-colors duration-200">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800 print:text-black">{edu.degree}</h3>
                          <p className="text-purple-600 font-medium print:text-black">{edu.institution}</p>
                        </div>
                        <p className="text-gray-600 italic whitespace-nowrap print:text-black bg-gray-100 px-2 py-1 rounded-md text-sm">
                          {edu.graduation}
                        </p>
                      </div>
                      {edu.description && (
                        <div 
                          className="mt-2 text-black pl-4 border-l-2 border-violet-200"
                          dangerouslySetInnerHTML={{ __html: formatDescription(edu.description) }} 
                        />
                      )}
                    </div>
                  )
                ))}
              </div>
            )}
            
            {formData.skills && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold border-b-2 border-violet-400 pb-2 mb-3 text-violet-800 print:text-black print:border-gray-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.split(',').map((skill, index) => (
                    skill.trim() ? (
                      <span 
                        key={index} 
                        className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-emerald-200 px-3 py-1 rounded-md text-sm text-teal-600 hover:shadow-md transition-shadow duration-200"
                      >
                        {skill.trim()}
                      </span>
                    ) : null
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0;
          }
          html, body {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color: #000 !important;
            background: white !important;
          }
          .resume-preview * {
            color: #000 !important;
          }
          .no-print {
            display: none !important;
          }
          a {
            text-decoration: none !important;
            color: #000 !important;
          }
          .resume-preview {
            position: relative;
            margin: 0;
            padding: 25mm;
            box-shadow: none;
            border: none;
          }
          /* Hide browser elements */
          #header, #footer, .header, .footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SimpleResumeBuilder;
