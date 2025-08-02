import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className="text-center">
    //     <h1 className="text-4xl font-bold mb-4">404</h1>
    //     <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
    //     <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
    //       Return to Home
    //     </Link>
    //   </div>
    // </div>

    //   <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 px-4 text-center">
    //   <h1 className="text-8xl font-extrabold text-purple-700 mb-6 select-none">404</h1>
    //   <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-lg">
    //     Sorry, the page you're looking for doesn’t exist.
    //   </p>
    //   <Link
    //     to="/"
    //     className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300"
    //   >
    //     Return to Home
    //   </Link>
    // </div>

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
      <h1
        className="text-8xl font-extrabold mb-6 select-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(249, 99%, 64%), hsl(278, 94%, 30%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        404
      </h1>
      <p className="text-2xl md:text-3xl text-gray-700 mb-8 max-w-lg">
        Sorry, i dont have the Page you are looking for.😉
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-3 font-semibold rounded-lg shadow-lg transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300"
        style={{
          background:
            "linear-gradient(90deg, hsl(249, 99%, 64%), hsl(278, 94%, 30%))",
          color: "white",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(90deg, hsl(249, 99%, 75%), hsl(278, 94%, 45%))")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background =
            "linear-gradient(90deg, hsl(249, 99%, 64%), hsl(278, 94%, 30%))")
        }
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
