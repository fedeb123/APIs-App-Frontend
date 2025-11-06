export function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
        active ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-600 hover:text-gray-900"
      }`}
    >
      <Icon className="w-5 h-5" /> {children}
    </button>
  )
}
