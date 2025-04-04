import { BarLoader } from "react-spinners";
import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <div className="px-5 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-100 hover:shadow-3xl transition-shadow duration-300">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            Industry Insights
          </h1>
        </div>

        {/* Content with Suspense Fallback */}
        <Suspense
          fallback={
            <div className="mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
              <BarLoader className="mt-4" width={"100%"} color="gray"  />
            </div>
          }
        >
          <div className="mt-8 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
            {children}
          </div>
        </Suspense>
      </div>
    </div>
  );
}