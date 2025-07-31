import { Construction } from "lucide-react";

export default function VirtualExam() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-gradient-to-r from-teal-100 to-teal-50 rounded-full shadow-lg">
            <Construction className="h-16 w-16 text-teal-600" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📘 Virtual Exam is coming soon!
          </h1>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            We're working on a comprehensive exam simulation feature to enhance your writing practice. Stay tuned!
          </p>
        </div>

        {/* Additional Information */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6 border border-teal-100 shadow-sm">
          <h2 className="text-xl font-semibold text-teal-800 mb-3">
            What's Coming
          </h2>
          <ul className="text-sm text-teal-700 space-y-2 text-left max-w-md mx-auto">
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>Full IELTS exam simulation with timing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>Real exam conditions and interface</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>Comprehensive scoring and feedback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              <span>Performance analytics and improvement tips</span>
            </li>
          </ul>
        </div>

        {/* Back to Practice */}
        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-4">
            In the meantime, continue practicing with our available tools:
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/writing-practice" 
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Writing Practice
            </a>
            <a 
              href="/essay-grading" 
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Essay Grading
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}