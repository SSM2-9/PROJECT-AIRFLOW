"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import styles from './index.module.css';

const getAqiText = (aqiIndex) => {
  switch (aqiIndex) {
    case 1: return "Good";
    case 2: return "Fair";
    case 3: return "Moderate";
    case 4: return "Poor";
    case 5: return "Very Poor";
    default: return "N/A";
  }
};

const convertAqiToScale = (aqiIndex) => {
  if (aqiIndex === null || aqiIndex === undefined) return "N/A";
  const scaleMap = { 1: 50, 2: 100, 3: 150, 4: 200, 5: 300 };
  return scaleMap[aqiIndex] || "N/A";
};

const getAqiAdvice = (aqiIndex) => {
    switch (aqiIndex) {
        case 1: return "It's a great day for outdoor activities!";
        case 2: return "Air quality is acceptable for most people.";
        case 3: return "Sensitive groups should reduce outdoor exertion.";
        case 4: return "Everyone may experience health effects.";
        case 5: return "Limit outdoor activity. Health alert.";
        default: return "Advice is not available.";
    }
}

const Dashboard2 = () => {
  // --- STATE MANAGEMENT ---
  const [locationsData, setLocationsData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      
      const locations = [
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
        { name: 'Mexico City', lat: 19.4326, lon: -99.1332 },
        { name: 'New York',    lat: 40.7128, lon: -74.0060 },
        { name: 'Vancouver',   lat: 49.2827, lon: -123.1207 }
      ];

      // Fetch weather data for the featured city (Los Angeles)
      const featuredCity = locations.find(loc => loc.name === 'Los Angeles');
      if (featuredCity) {
          try {
              const weatherRes = await fetch(`/api/openweather-weather?lat=${featuredCity.lat}&lon=${featuredCity.lon}`);
              if (!weatherRes.ok) throw new Error("Weather API request failed");
              const weatherJson = await weatherRes.json();
              console.log("Weather Data Received:", weatherJson);
              
              // CHANGED: The new API data is the root object, not weatherJson.current
              setWeatherData(weatherJson); 
              
          } catch (err) {
              console.error("Failed to fetch weather data:", err);
          }
      }
      const promises = locations.map(async (location) => {
        try {
          const res = await fetch(`/api/openweathermap?lat=${location.lat}&lon=${location.lon}`);
          if (!res.ok) throw new Error(`Failed to fetch data for ${location.name}`);
          const data = await res.json();
          if (data.list && data.list.length > 0) {
            return { name: location.name, aqi: data.list[0].main.aqi, components: data.list[0].components, dt: data.list[0].dt };
          }
          return { name: location.name, error: 'Data Unavailable' };
        } catch (err) {
          console.error(`Fetch error for ${location.name}:`, err);
          return { name: location.name, error: err.message };
        }
      });

      const allData = await Promise.all(promises);
      setLocationsData(allData);
      setIsLoading(false);
    };

    fetchAllData();
  }, []);

  // This helper function gets a specific pollutant's value from the 'components' object.
  const getMeasurementValue = (components, parameter) => {
    if (!components || components[parameter] === undefined) return "N/A";
    return components[parameter].toFixed(2);
  };

  return (
    <div className={styles.dashboard2}>
      {/* Header & Navigation */}
      <div className={styles.headerNavigation}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.logo}><div className={styles.logoWrap}><Link href="/"><Image src="/Logo_1.png" width={107} height={41} alt="Logo" /></Link></div></div>
            <div className={styles.navigation}>
              <div className={styles.navItemBase}><div className={styles.dashboard2Content}><div className={styles.textAndIcon}><div className={styles.text}>Dashboard</div></div></div></div>
              <div className={styles.dashboard2NavItemBase}><div className={styles.content2}><Link href="/map" className={styles.textAndIcon}><div className={styles.textAndIcon}>Forecast Map</div></Link></div></div>
              <div className={styles.dashboard2NavItemBase}><div className={styles.content2}><div className={styles.textAndIcon}><div className={styles.text}>Schedule</div></div></div></div>
              <div className={styles.dashboard2NavItemBase}><div className={styles.content2}><div className={styles.textAndIcon}><div className={styles.text}>Data Explorer</div></div></div></div>
            </div>
          </div>
          <div className={styles.content5}>
            <div className={styles.actions}>
              <div className={styles.navItemButton}><Image src="/search-lg.png" width={20} height={20} alt="Search" /></div>
              <div className={styles.navItemButton}><Image src="/settings-01.png" width={20} height={20} alt="Settings" /></div>
              <div className={styles.navItemButton}><Image src="/bell-01.png" width={20} height={20} alt="Notifications" /></div>
            </div>
            <div className={styles.dropdown}><div className={styles.avatar}><Image src="/Avatar.png" width={24} height={24} alt="Avatar" /></div></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.frameParent}>
        {isLoading && <p style={{ textAlign: "center", padding: 40, fontSize: 18 }}>Loading Live Air Quality Data...</p>}
        {error && <p style={{ textAlign: "center", padding: 40, color: "red", fontSize: 18 }}>{error}</p>}
        
        {!isLoading && !error && (
          <>
            {/* Featured Location AQI (Los Angeles) */}
            {(() => {
              const featuredLocation = locationsData.find((loc) => loc.name === "Los Angeles");
              if (!featuredLocation || featuredLocation.error) {
                  return <p style={{ textAlign: "center", padding: 40, fontSize: 18 }}>Los Angeles data is unavailable.</p>;
              }

              const aqiIndex = featuredLocation.aqi;
              const aqiValue = convertAqiToScale(aqiIndex);
              const aqiAdvice = getAqiAdvice(aqiIndex);
              const aqiText = getAqiText(aqiIndex);
              
              return (
                <div className={styles.aqiRealTimeParent}>
                  <div className={styles.aqiRealTime}>
                    <div className={styles.card}>
                      <div className={styles.content6}>
                        <div className={styles.headerAndNumber}>
                          <div className={styles.content7}>
                            <div className={styles.textAndSupportingText}><div className={styles.text4}>Current AQI Score for {featuredLocation.name}</div></div>
                            <div className={styles.dashboard2Actions}><div className={styles.buttonsbutton}><div className={styles.textPadding}><div className={styles.text}>{aqiText}</div></div></div></div>
                          </div>
                          <div className={styles.numberAndBadge}>
                            <div className={styles.numberParent}><div className={styles.number}>{aqiValue}</div></div>
                            <div className={styles.dashboard2Number}>{aqiAdvice}</div>
                          </div>
                        </div>
                        <div className={styles.frameGroup}>
                          <div className={styles.goodParent}><div className={styles.good}>Good</div><div className={styles.dashboard2Good}>Moderate</div><div className={styles.good2}>Unhealthy</div></div>
                          <div className={styles.progressLineParent}><div className={styles.progressLine} /><div className={styles.dashboard2ProgressLine} /><div className={styles.progressLine2} /><div className={styles.progressLine3} /><div className={styles.progressLine4} /><div className={styles.progressLine5} /></div>
                          <div className={styles.textParent}><div className={styles.text7}>0</div><div className={styles.text7}>50</div><div className={styles.good2}>100</div><div className={styles.good2}>150</div><div className={styles.good2}>200</div><div className={styles.good2}>300</div><div className={styles.good2}>500</div></div>
                          {aqiValue !== "N/A" && <div className={styles.handle} style={{ left: `${Math.min(aqiValue / 5, 100)}%` }} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Favorite Cities Cards with Links */}
            <div className={styles.favParent}>
              <div className={styles.fav}>
                <div className={styles.section}>
                  <div className={styles.container2}>
                    <div className={styles.metricGroup}>
                      {locationsData.map((location, idx) => {
                         if (location.error) {
                            return (
                                <div className={styles.metricItem} key={idx}>
                                    <div className={styles.heading}>{location.name}</div>
                                    <div className={styles.number2}>Error</div>
                                </div>
                            );
                         }
                        
                        const slug = location.name.toLowerCase().replace(/ /g, '-');
                        const aqiValue = convertAqiToScale(location.aqi);
                        const aqiText = getAqiText(location.aqi);
                        const lastUpdated = location.dt ? new Date(location.dt * 1000).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "N/A";
                        
                        return (
                          <Link href={`/location/${slug}`} key={idx} className={styles.metricItemLink}>
                            <div className={styles.metricItem}>
                              <div className={styles.heading}>{location.name} - {lastUpdated}</div>
                              <div className={styles.dashboard2NumberAndBadge}>
                                <div className={styles.number2}>{aqiValue}</div>
                                <div className={styles.badge8}><div className={styles.dot}><div className={styles.dot17} /></div><div className={styles.percentage}>{aqiText}</div></div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pollutant Cards for the Featured Location */}
            {(() => {
              const featuredLocation = locationsData.find((loc) => loc.name === "Los Angeles");
              if (!featuredLocation || featuredLocation.error) return null;
              
              const PollutantCard = ({ name, formula, parameter, unit, styleClass }) => {
                const value = getMeasurementValue(featuredLocation.components, parameter);
                return (
                  <div className={styles[styleClass]}>
                    <div className={styles.headingAndNumber}>
                      <div className={styles.text4}>{name} {formula}</div>
                      <div className={styles.numberAndBadge4}>
                        <div className={styles.tableHeaderLabel}><div className={styles.number2}>{value}</div><div className={styles.text55}>{unit}</div></div>
                      </div>
                    </div>
                  </div>
                );
              };

              return (
                <div className={styles.nitrogendioxideParent}>
                  <PollutantCard name="PM2.5" formula={<>PM<sub>2.5</sub></>} parameter="pm2_5" unit="µg/m³" styleClass="pm" />
                  <PollutantCard name="PM10" formula={<>PM<sub>10</sub></>} parameter="pm10" unit="µg/m³" styleClass="pm" />
                  <PollutantCard name="Nitrogen Dioxide" formula={<>NO<sub>2</sub></>} parameter="no2" unit="µg/m³" styleClass="nitrogendioxide" />
                  <PollutantCard name="Ozone" formula={<>O<sub>3</sub></>} parameter="o3" unit="µg/m³" styleClass="ozone" />
                  <PollutantCard name="Carbon Monoxide" formula={<>CO</>} parameter="co" unit="µg/m³" styleClass="ozone" />
                  <PollutantCard name="Sulphur Dioxide" formula={<>SO<sub>2</sub></>} parameter="so2" unit="µg/m³" styleClass="pm" />
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Dynamic Footer */}
      <div className={styles.dashboard2HeaderSection}>
        <div className={styles.container4}>
            <div className={styles.dashboard2PageHeader}>
                <div className={styles.content16}>
                    <div className={styles.textAndSupportingText25}><div className={styles.text65}>Los Angeles</div></div>
                    <div className={styles.actions4}>
                        <div className={styles.buttonsbutton5}>
                            <Image src="/Icon.png" width={20} height={20} alt="Weather icon" />
                            <div className={styles.textPadding}>
                                <div className={styles.number2}>
                                    {/* Access temp via weatherData.main.temp */}
                                    {weatherData?.main ? `${Math.round(weatherData.main.temp)}` : '--'}<sup>°</sup>C 
                                    {weatherData?.weather ? weatherData.weather[0].main : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.dividerIcon7} style={{ width: "100%", height: "1px", backgroundColor: "#eaecf0" }} />
            </div>
            <div className={styles.dashboard2TabsAndFilters}>
                <div className={styles.buttonGroup2} />
                <div className={styles.content5}>
                    {/* Humidity */}
                    <div className={styles.windSpeed}>
                        <Image src="/droplets-03.png" width={20} height={20} alt="Humidity icon" />
                        {/* Access humidity via weatherData.main.humidity */}
                        <div className={styles.div}>{weatherData?.main ? `${weatherData.main.humidity}%` : '--'}</div>
                        <div className={styles.textPadding4}><div className={styles.div}>Humidity</div></div>
                    </div>
                    {/* Wind Speed */}
                    <div className={styles.windSpeed}>
                        <Image src="/Wind.png" width={20} height={20} alt="Wind icon" />
                        {/*Access wind speed via weatherData.wind.speed */}
                        <div className={styles.div}>{weatherData?.wind ? `${(weatherData.wind.speed * 3.6).toFixed(1)} km/h` : '--'}</div>
                        <div className={styles.textPadding4}><div className={styles.div}>Wind speed</div></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard2;
