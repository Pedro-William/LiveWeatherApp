import { useState } from 'react'
import SearchBar from './SearchBar'
import WeatherCard from './WeatherCard'
import loadingGif from '../assets/images/loading.gif'
import { getWeatherInfo } from '../utils/weatherCode'
import { getCoordinates, getCurrentWeather } from '../services/weatherApi'
import { weatherImages, backgroundImages } from '../constants/weatherTheme'

const WheatherApp = () => {
    const [location,setLocation] = useState('')
    const [data,setData] = useState(null)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState('')

    const handleInputChanges = (e) => {
        setLocation(e.target.value)
      }

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          search(location)
        }
      }

      const search = async (city) => {
        const normalizedCity = city.trim()

        if (!normalizedCity) {
          setError('Enter a city name')
          return
        }

        try {
          setLoading(true)
          setError('')

          const coordinates = await getCoordinates(normalizedCity)

          if (!coordinates) {
            setError('City not found')
            setData(null)
            return
          }

          const currentWeather = await getCurrentWeather(
            coordinates.latitude,
            coordinates.longitude
          )

          setData({
            city: coordinates.name,
            country: coordinates.country,
            temperature: currentWeather.temperature_2m,
            humidity: currentWeather.relative_humidity_2m,
            windSpeed: currentWeather.wind_speed_10m,
            weatherCode: currentWeather.weather_code,
            time: currentWeather.time
          })

          setLocation('')
        } catch (err) {
          console.error(err)
          setError(err.message || 'Unable to load weather data')
          setData(null)
        } finally {
          setLoading(false)
        }
      }

  const weatherInfo = data
    ? getWeatherInfo(data.weatherCode)
    : null

  const weatherType = weatherInfo?.type || 'sunny'
  const weatherImage = weatherImages[weatherType]
  const backgroundImage = backgroundImages[weatherType]

  return (
    <div
      className="container"
      style={{ backgroundImage }}
    >
      <div
        className="weather-app"
        style={{
          backgroundImage: backgroundImage.replace(
            'to right',
            'to top'
          )
        }}
      >
        <SearchBar
          location={location}
          handleInputChanges={handleInputChanges}
          handleKeyDown={handleKeyDown}
          search={search}
          city={data?.city}
        />

        {loading ? (
          <img
            className="loader"
            src={loadingGif}
            alt="Loading"
          />
        ) : error ? (
          <div className="not-found">{error}</div>
        ) : data && (
          <>
            <WeatherCard
              data={data}
              weatherInfo={weatherInfo}
              weatherImage={weatherImage}
            />

            <div className="weather-data">
              <div className="humidity">
                <div className="data-name">Humidity</div>
                <i className="fa-solid fa-droplet"></i>
                <div className="data">{`${data.humidity}%`}</div>
              </div>

              <div className="wind">
                <div className="data-name">Wind</div>
                <i className="fa-solid fa-wind"></i>
                <div className="data">{`${data.windSpeed} km/h`}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WheatherApp