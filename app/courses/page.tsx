export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Explore Our <span className="text-teal-600">Courses</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn from industry experts and advance your skills with our comprehensive course catalog.
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((course) => (
            <div key={course} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-teal-400 to-teal-600"></div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Course Title {course}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn essential skills with expert instructors and hands-on projects.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">8 weeks</span>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm font-bold">
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
