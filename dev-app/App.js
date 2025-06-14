import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import axios from 'axios';


const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'dfd3af8a5abb7405b4d2003a16b2b7da';




export default function App() {

  const [weather, setWeather] = useState();



  useEffect(() => { // use Effect é chamado que o app abrir
    getLocation()
  }, [])

  async function getLocation() {

    let { status } = await Location.requestForegroundPermissionsAsync(); //vai fazer um pedido ao usuario se ele permite
    if (status !== 'granted') { //verifica se permitiu a localização
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    console.log(location)

    const response = await axios.get(API_URL, {
      params: {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    })

    console.log(response.data)

    setWeather(response.data) //quando a informação chegar o setWeather coloca a informação no weather 

  }

  function getBackgrundColor() {
    const main = weather.weather[0].main.toLowerCase();

    if (main.includes('rain')) return '#4A7C8E';
    if (main.includes('cloud')) return '#8895A1';
    if (main.includes('clear')) return '#87CEEB';
    return '#6495ED';
  }

  return (


    <View style={[styles.container, { backgroundColor: weather ? getBackgrundColor() : '#ccc' }]}>

      {!weather ? (
        <Text>Carregando clima...</Text>
      ) : (
        <>
          <Text style={styles.cityName}>{weather.name}</Text>

          <Text style={styles.temperature}>{Math.round(weather.main.temp)}Celsius </Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>

          <View style={styles.infoContainer}>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Sensação</Text>
              <Text style={styles.infoValue}>{Math.round(weather.main.feels_like)} Celsius</Text>
            </View>


            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Umidade</Text>
              <Text style={styles.infoValue}>{Math.round(weather.main.humidity)}%</Text>
            </View>


            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Velocidade do Vento</Text>
              <Text style={styles.infoValue}>{Math.round(weather.wind.speed)}m/s</Text>
            </View>



          </View>

        </>
      )}
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,

  },

  temperature: {
    fontSize: 72,
    fontWeight: 300,
    color: '#fff',
    marginBottom: 10,
  },
  description:{
    fontSize:24,
    color:'#fff',
    marginBottom: 40,
    textTransform:'capitalize'


  },
   infoBox: {
     alignItems: 'center',
     backgroundColor: ' rgba(255,255,255,0.2)',
     padding: 15, 
     borderRadius: 10,
     minWidth:80
  },

  infoContainer: {
      flexDirection:'row',
      justifyContent: 'space-around',
      width: '100%'
  },
  infoLabel:{
    
    fontSize:14,
    color: '#fff',
    opacity : 0.8,
    marginBottom: 5,
    fontWeight:'Bold'
  },
  infoValue: {
   fontSize: 20,
   color: '#fff',
   fontWeight: 'bold'
  },
  
});
