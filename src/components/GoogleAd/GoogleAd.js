// import React, { useEffect } from "react";

// const GoogleAd = () => {
//   useEffect(() => {
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//     } catch (e) {
//       console.error("Adsbygoogle error:", e);
//     }
//   }, []);

//   return (
//     <ins
//       className="adsbygoogle"
//       style={{ display: "block" }}
//       data-ad-client="ca-pub-8031141340234257"
//       data-ad-slot="3168583261"
//       data-ad-format="auto"
//       data-full-width-responsive="true"
//     ></ins>
//   );
// };

// export default GoogleAd; 
// 
// import React, { useEffect } from 'react';

// const AdSense = () => {
//   useEffect(() => {
//     try {
//       // Load the AdSense script
//       const script = document.createElement('script');
//       script.src = "https://pagead2.googlesyndleware.com/pagead/js/adsbygoogle.js?client=ca-pub-8031141340234257";
//       script.crossOrigin = "anonymous";
//       script.async = true;
      
//       // Only try to push ads after the script has loaded
//       script.onload = () => {
//         try {
//           (window.adsbygoogle = window.adsbygoogle || []).push({});
//         } catch (error) {
//           console.error('Error pushing ad:', error);
//         }
//       };

//       document.head.appendChild(script);

//       // Cleanup
//       return () => {
//         document.head.removeChild(script);
//       };
//     } catch (error) {
//       console.error('Error loading AdSense script:', error);
//     }
//   }, []);

//   return (
//     <ins
//       className="adsbygoogle"
//       style={{ display: 'block' }}
//       data-ad-client="ca-pub-8031141340234257"
//       data-ad-slot="3168583261"
//       data-ad-format="auto"
//     />
//   );
// };

// export default AdSense;
import React, { useEffect } from 'react';

const DevAdsense = () => {
  useEffect(() => {
    // Check if we're in development
    // const isDevelopment = process.env.NODE_ENV === 'development';
        const isDevelopment = true;

    const loadAds = () => {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        if (isDevelopment) {
          console.log('AdSense error in development:', error);
        }
      }
    };

    // Add a small delay to ensure proper initialization
    const timeoutId = setTimeout(loadAds, 100);

    // Cleanup
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {/* AdSense Display Unit */}
      <ins 
        className="adsbygoogle"
        style={{
        //   display: 'block',
        //   minHeight: '280px',  // Ensures space is reserved for the ad
        //   width: '100%',
        //   background: '#f1f1f1' // Visual placeholder in development
        }}
        data-ad-client="ca-pub-8031141340234257"
        data-ad-slot="3168583261"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
};

export default DevAdsense;