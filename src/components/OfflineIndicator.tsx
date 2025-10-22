import { useState, useEffect } from 'react';
import { WifiOff } from 'lucide-react';
import Image  from 'next/image';
import en from "@/locales/en.json";
import kh from "@/locales/km.json";
import { useLanguage } from "@/context/LanguageContext";

export default function OfflineIndicator() {
  const { language } = useLanguage();
  const t = language === "en" ? en : kh;

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo and Offline Icon Container */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {/* Logo Circle */}
  
          <div className="w-34 h-34 rounded-full bg-gray-100 border-4 border-blue-800 flex flex-col items-center justify-center shadow-lg">
          
              <div>  
                <Image 
                src="/logo-sq.png"
                width={74}
                height={74}
                alt="Logo"
              /></div>
              <p className='text-blue-800 font-bold
              '>STACK<span className='text-yellow font-bold'>QUIZ</span></p>
           
      
          </div>

            {/* Offline Icon */}
          <div className="w-34 h-34 rounded-full bg-red-100 flex items-center justify-center shadow-lg border-4 border-red-300">
            <WifiOff className="w-14 h-14 text-red-500 stroke-[2.5]" />
          </div>
        </div>

  
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
           {t.offline.noInter}
        </h1>
        
        <p className="text-lg text-gray-600" >
            {t.offline.please}
        </p>
      </div>
    </div>
  );
}