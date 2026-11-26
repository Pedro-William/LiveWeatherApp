const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const fetchJson = async (url) => {
  let response

  try {
    response = await fetch(url)
  } catch {
    throw new Error('Unable to load weather data')
  }

  if (!response.ok) {
    throw new Error('Unable to load weather data')
  }

  return response.json()
}

export const getCoordinates = async (cityName) => {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`

  const coordinateData = await fetchJson(url)

  if (!coordinateData.results || coordinateData.results.length === 0) {
    throw new Error('City not found')
  }

  const city = coordinateData.results[0]

  return {
    name: city.name,
    country: city.country,
    latitude: city.latitude,
    longitude: city.longitude
  }
}

export const getCurrentWeather = async (latitude, longitude) => {
  const currentFields = [
    'temperature_2m',
    'relative_humidity_2m',
    'wind_speed_10m',
    'weather_code'
  ].join(',')

  const url = `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}&current=${currentFields}&timezone=auto`

  const weatherData = await fetchJson(url)

  return weatherData.current
}
