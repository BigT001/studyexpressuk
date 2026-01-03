export default function CoursesManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Courses & Trainings Management</h2>
        <p className="text-gray-600 mt-2">Create, publish, and manage educational content</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-600">
          <h3 className="text-lg font-bold mb-4">📚 Manage Courses</h3>
          <p className="text-gray-600 text-sm mb-4">Create and edit course content, materials, and curriculum</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            View Courses
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-purple-600">
          <h3 className="text-lg font-bold mb-4">🎓 Training Programs</h3>
          <p className="text-gray-600 text-sm mb-4">Organize and manage structured training programs</p>
          <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700">
            View Trainings
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-t-4 border-green-600">
          <h3 className="text-lg font-bold mb-4">✅ Enrollment Status</h3>
          <p className="text-gray-600 text-sm mb-4">Track student enrollments and completion status</p>
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            View Enrollments
          </button>
        </div>
      </div>
    </div>
  );
}
