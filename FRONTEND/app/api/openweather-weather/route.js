import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is not configured on the server' }, { status: 500 });
  }

  // This URL now points to the "Current Weather" endpoint.
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    // Send the data back to your page.
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching from OpenWeather Current API:', error);
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
