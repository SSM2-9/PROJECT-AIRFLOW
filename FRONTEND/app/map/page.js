// Ensure you have this at the top of your Next.js page file
"use client";

// Imports from BOTH of your files
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from 'next/link';
import styles from "./map.module.css"; // Make sure this CSS file path is correct

// DYNAMIC IMPORT for the interactive Leaflet Map (from your logic file)
// This is crucial for making the map work.
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <p>Loading map component...</p>
});

// Let's call the final component MapPage
const MapPage = () => {
  // LOGIC: All the state management from your first file is now here
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const max_date = new Date().toISOString().split("T")[0];

  // LOGIC: The data fetching function from your first file
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiResponse(null);

    const apiUrl = `http://127.0.0.1:8000/api/tempo-no2?city=${city}&str_date=${startDate}&end_date=${endDate}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Success:", data);
        setApiResponse(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setApiResponse({ error: "Failed to fetch data. Is the server running?" });
        setIsLoading(false);
      });
  };

  // Here we start the JSX from your styled component
  return (
    <div className={styles.map}>
      {/* Header Navigation (from styled component) */}
      <div className={styles.headerNavigation}>
        {/* ... your header code is fine, no changes needed here ... */}
         <div className={styles.mapContainer}>
          <div className={styles.content6}>
            <div className={styles.logo}>
              <div className={styles.logoWrap}>
                <Link href="/"><Image className={styles.logoWrap} src="/Logo_1.png" width={107} height={41} alt="Logo" /></Link>
              </div>
            </div>
            <div className={styles.navigation}>
              <div className={styles.navItemBase}>
                <div className={styles.content7}>
                  <div className={styles.textAndIcon}>
                    <div className={styles.text26}><Link href="/" className={styles.text26}>Dashboard</Link></div>
                  </div>
                </div>
              </div>
              <div className={styles.navItemBase}>
                <div className={styles.content8}>
                  <div className={styles.textAndIcon}>
                    <div className={styles.text26}>Forecast Map</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.content11}>
            <div className={styles.actions2}>
              {/* ... Icons etc ... */}
            </div>
          </div>
        </div>
      </div>

      {/* Main Section (from styled component) */}
      <div className={styles.main}>
        <div className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sections}>
              <div className={styles.mapSection}>
                <div className={styles.card}>
                  <div className={styles.content}>
                    
                    {/* Section Header */}
                    <div className={styles.sectionHeader}>
                      <div className={styles.mapContent}>
                        <div className={styles.textAndSupportingText}>
                          <div className={styles.text}>AQI Forecast Map</div>
                        </div>
                      </div>
                      <Image className={styles.dividerIcon} src="/path/to/divider.svg" width={1168} height={1} alt="" />
                    </div>

                    {/* INTEGRATION: Adding the form here for data input */}
                    <div className={styles.formContainer}> {/* You can add styling for this class */}
                      <h3>Input Information Below</h3>
                      <form onSubmit={handleSubmit} className={styles.dataForm}> {/* Add styling */}
                        <label>City:</label>
                        <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} required />
                        <label>Start Date:</label>
                        <input type="date" name="str_date" max={max_date} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                        <label>End Date:</label>
                        <input type="date" name="end_date" max={max_date} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                        <input type="submit" value={isLoading ? "Loading..." : "Submit"} disabled={isLoading} />
                      </form>
                    </div>

                    {/* Map & Sidebar */}
                    <div className={styles.mapAndData}>
                      {/* INTEGRATION: Replacing the static image with the dynamic map */}
                      <div className={styles.mapWrap} style={{ display: 'block', height: '500px' }}> {/* Overriding display:none */}
                        {isLoading && <p>Loading NASA data, this may take a moment...</p>}
                        
                        {apiResponse && !apiResponse.error && apiResponse.length > 0 && (
                          <Map data={apiResponse} />
                        )}

                        {apiResponse && apiResponse.error && (
                            <div className={styles.response}>
                                <h2>Error:</h2>
                                <p>{apiResponse.error}</p>
                            </div>
                        )}

                        {apiResponse && !apiResponse.error && apiResponse.length === 0 && (
                            <p>No data points found for the selected criteria.</p>
                        )}
                        
                        {!apiResponse && !isLoading && (
                           <p>Please enter a city and date range to see the map.</p>
                        )}
                      </div>

                      {/* Sidebar */}
                      {/* NOTE: This sidebar is still STATIC. You'll need to update it with apiResponse data. */}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;