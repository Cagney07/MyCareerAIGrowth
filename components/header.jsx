
import { SignedIn,SignedOut,SignInButton,UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, StarsIcon } from "lucide-react";

import { DropdownMenu } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuContent } from "./ui/dropdown-menu";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";

const Header= async()=>{//server component
    await checkUser();
    return(

        <header className="fixed top-0 w-full boarder-b bg-background/80 backdrop-blur-md z-50 suports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href='/'>
                <Image src="/Untitled design.png" alt="My CareeerAI Coach" width={200} height={60}
                className="h-12 py-1 w-auto object-contain"/>
                </Link>

                <div className="flex items-center space-x-2 md:space-x-4">
                    <SignedIn>
                        <Link href={"/dashboard"}>
                        <Button  variant="outline">
                            <LayoutDashboard className="h-4 w-4"/>
                            <spam className="hidden md:block">Industry Insight</spam>
                        
                        </Button>
                        </Link>
                   
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button>
                            <StarsIcon className="h-4 w-4"/>
                            <span className="hidden md:block">Growth Tools</span>
                            <ChevronDown className="h-4 w-4"/>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                        
                            <DropdownMenuItem>
                                <Link href={"/resume"} className="flex items-center gap-2">
                               <FileText className="h-4 w-4"/>
                               <span >Build Resume </span>
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                               <PenBox className="h-4 w-4"/>
                               <spam>Create Cover Letter </spam>
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                            <Link href={"/interview"} className="flex items-center gap-2">
                               <GraduationCap className="h-4 w-4"/>
                               <spam >Interview Preparation </spam>
                               </Link>
                            </DropdownMenuItem>
                            
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </SignedIn>


            <SignedOut>
              <SignInButton>
              <Button variant="outline">Sign In</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton 
              appearance={{
                elements:{
                    avatarBox:"w-10 h-10",
                    userButtonPopoverCard:"shadow-xl",
                    userPreviewMainIdentifier:"font-semibold",
                },
            
              }}/>
            </SignedIn>
                </div>
            </nav>

        </header>
    
    )
}

export default Header