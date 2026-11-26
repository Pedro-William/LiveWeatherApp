const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

export const getCoordinates = async (cityName) => {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Unable to load weather data')
  }

  const coordinateData = await response.json()

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

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Unable to load weather data')
  }

  const weatherData = await response.json()

  return weatherData.current
}
