import { Link } from "wouter";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileEdit, BookOpen, History, Medal, BarChart3, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Improve Your English Writing Skills
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice writing essays, get instant feedback, and enhance your vocabulary
          with our comprehensive writing tools.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" /> Writing Task 1
            </CardTitle>
            <CardDescription>
              Practice academic writing based on visuals like charts and tables.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600">
              Write essays from IELTS-style prompts that include bar charts, pie graphs, or tables.
              Choose your band level and receive structured feedback to improve your writing.
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="space-y-2 w-full">
              <Link href="/writing-task-1">
                <Button className="w-full" variant="default" size="sm">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Practice Writing Task 1
                </Button>
              </Link>
              <Link href="/essay-grading?task=task1">
                <Button className="w-full" variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Grade My Writing Task 1
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileEdit className="h-5 w-5 text-primary" /> Writing Task 2
            </CardTitle>
            <CardDescription>
              Practice writing for different tests and scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600">Write essays from IELTS-style prompts that explore opinions, discussions, and real-life scenarios. Get personalized feedback tailored to your target band score</p>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="space-y-2 w-full">
              <Link href="/writing-practice">
                <Button className="w-full" variant="default" size="sm">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Practice Writing Task 2
                </Button>
              </Link>
              <Link href="/essay-grading">
                <Button className="w-full" variant="outline" size="sm">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Grade My Writing Task 2
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-600" /> Progress Tracking
            </CardTitle>
            <CardDescription>
              Track your improvement over time
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-600">
              See your writing progress and improvement areas. Get insights on your
              vocabulary range, grammar accuracy, and more.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/progress-tracking">
              <Button className="w-full pt-[7.6px] pb-[7.6px] mt-[17px] mb-[17px]">
                My Progress <span className="ml-4">→</span>
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8 text-center border border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-yellow-100 rounded-full mr-3 transform group-hover:rotate-12 transition-transform duration-300">
            <Medal className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">Premium Writing Assistant</h2>
        </div>
        <p className="text-gray-700 max-w-2xl mx-auto mb-6">
          Get advanced features with our premium plan: detailed essay analysis,
          personalized improvement suggestions, and professional evaluation.
        </p>
        <Button 
          className="bg-purple-800 hover:bg-purple-900 text-yellow-300 border-2 border-yellow-400 hover:border-yellow-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-inner" 
          onClick={() => alert('Premium features coming soon!')}
        >
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
}
