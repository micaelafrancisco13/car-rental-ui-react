import { useNavigate } from 'react-router-dom';
import { Car, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import bg1 from '../assets/images/HomepageBG1.jpg'
import bg2 from '../assets/images/HomepageBG2.jpg'
import bg3 from '../assets/images/HomepageBG3.jpg'
const HomePage = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
   bg1, bg2, bg3
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      title: "Vehicle Inventory",
      description: "Browse our extensive collection of well-maintained vehicles",
      icon: <Car className="w-6 h-6 text-cyan-600" />,
      delay: "delay-0"
    },
    {
      title: "Reservation",
      description: "Quick and easy booking process with instant confirmation",
      icon: <Calendar className="w-6 h-6 text-cyan-600" />,
      delay: "delay-100"
    },
    {
      title: "Fleet Tracking",
      description: "Real-time tracking and status updates for your rental",
      icon: <MapPin className="w-6 h-6 text-cyan-600" />,
      delay: "delay-200"
    }
  ];

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* Background Image Carousel */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 
            ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }
        `}
          style={{
            backgroundImage: `url('${image}')`,
            filter: "grayscale(30%)"
          }}
        />
      ))}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 opacity-25" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-cyan-50 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-50 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        <header className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-4 animate-gradient">
            Rental Vehicle
          </h1>
          <p className="text-2xl text-gray-700 mt-2 opacity-0 animate-fade-in">
            Your Journey, Your Car, Your Way
          </p>
        </header>

        <main className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl transform transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8 opacity-0 animate-fade-in">
            Car Rental Made Simple
          </h2>
          
          <p className="text-gray-600 mb-12 text-lg leading-relaxed opacity-0 animate-fade-in">
            Explore our wide range of vehicles and find the perfect car for your journey. 
            Whether you're traveling for business or pleasure, we have the right car for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`bg-gradient-to-br from-cyan-50 to-white p-6 rounded-xl shadow-sm 
                transform transition-all duration-300 hover:scale-105 hover:shadow-lg 
                opacity-0 animate-fade-in ${feature.delay}`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-cyan-600">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center transform transition-all duration-500 opacity-0 animate-fade-in delay-500">
            <button 
              onClick={() => navigate("/login")}
              className="group bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-8 py-3 rounded-full 
              font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105
              flex items-center justify-center space-x-2 mx-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;