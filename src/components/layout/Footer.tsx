export default function Footer() {
    return (
      <footer className="bg-gray-100 text-gray-600 text-sm mt-10 py-4">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <p>&copy; {new Date().getFullYear()} EventEase. All rights reserved.</p>
          <p>Built with ❤️ and Next.js</p>
        </div>
      </footer>
    );
  }
  