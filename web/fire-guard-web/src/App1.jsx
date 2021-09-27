import React, { useEffect } from "react";
import './App.css';



function App() {
  const [urmom, seturmom] = React.useState();
  useEffect  = () => {
    seturmom({
      humidity: 20,
      unsafeTemperature: true,
      temperatureData: [],
      humidityData: [],
      carbonDioxideData: [],
      totalVolatileOrganicCompoundData: [],
      altitudeData: [],
      atomospherePressureData: [],
      showTemperature: true,
      showHumidity: true,
      showCarbonDioxide: true,
      showTotalVolatileOrganicCompound: true,
      showAltitude: true,
      showAtmosphericPressure: true,
      temperature: '',
      humidity: '',
      carbonDioxide: '',
      totalVolatileOrganicCompound: '',
      altitude: '',
      atmosphericpressure: '',
      toggleButtonWidth: 125,
      options: {
        chart: {
          id: 'vuechart-example'
        },
        colors: ['#0078FF']
      },
      dangerOptions: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {  
          labels: {
            style: {
              fontSize: 16,
              color: '#FFFFFF'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
               color: '#FFFFFF',
               fontSize: 16
            }
          }
        },
        colors: ['#FFFFFF']
      },
      tempSeries: [{
        name: 'series-1',
        data: [0]
      }],
      carbonDioxideSeries: [{
        name: 'series-3',
        data: [0]
      }],
      totalVolatileOrganicCompoundSeries: [{
        name: 'series-4',
        data: [0]
      }],
      altitudeSeries: [{
        name: 'series-5',
        data: [0]
      }],
      atmosphericPressureSeries: [{
        name: 'series-5',
        data: [0]
      }],
      showTemperatureAlert: false,
      showHumidityAlert: false,
      showCarbonDioxideAlert: false,
      showTotalVolatileOrganicCompoundAlert: false,
      computed: {
        temperatureClassObject: function(){
          return {
            'bg-danger' : this.showTemperatureAlert,
            'bg-light': !this.showTemperatureAlert,
            'whiteText' : this.showTemperatureAlert,
          }
        },
        humidityClassObject: function(){
           return {
            'bg-danger' : this.showHumidityAlert,
            'bg-light': !this.showHumidityAlert,
            'whiteText' : this.showHumidityAlert,
          }
        },
        carbonDioxideClassObject: function(){
           return {
            'bg-danger' : this.showCarbonDioxideAlert,
            'bg-light': !this.showCarbonDioxideAlert,
            'whiteText' : this.showCarbonDioxideAlert,
          }
        },
        totalVolatileOrganicCompoundClassObject: function(){
           return {
            'bg-danger' : this.showTotalVolatileOrganicCompoundAlert,
            'bg-light': !this.showTotalVolatileOrganicCompoundAlert,
            'whiteText' : this.showTotalVolatileOrganicCompoundAlert,
          }
        },
        temperatureOptions: function(){ 
          return this.showTemperatureAlert ? this.dangerOptions : this.options
        },
        humidityOptions: function() {
          return this.showHumidityAlert ? this.dangerOptions : this.options
        },
        carbonDioxideOptions: function() {
          return this.showCarbonDioxideAlert ? this.dangerOptions : this.options
        },
        totalVolatileOrganicCompoundOptions: function() {
          return this.showTotalVolatileOrganicCompoundAlert ? this.dangerOptions : this.options
        }
      },
      watch: {
        
      },
      created() {
        const tempRef = database.ref('DHT11').child('temperature')
        const humRef = database.ref('DHT11').child('humidity')
        const coRef = database.ref('CCS811').child('CO2')
        const tvocRef = database.ref('CCS811').child('TVOC')
        const atomospherePressureRef = database.ref('BME280').child('Pressure')
        const altitudeRef = database.ref('BME280').child('Altitude')
        // tempRef.remove();
        // humRef.remove();
        // coRef.remove()
        // tvocRef.remove()
        // atomospherePressureRef.remove()
        // altitudeRef.remove()
        tempRef.limitToLast(1).on('value', querySnapshot => {
          let data = querySnapshot.val();
          let value = Object.values(data)
        
          if (value >= 20) {
            this.showTemperatureAlert = true;
          } else {
            this.showTemperatureAlert = false;
          }
         
          this.temperatureData.push({ x : this.setTime(), y : value.toString()})
          if (this.temperatureData.length > 8) {
            this.temperatureData = this.temperatureData.slice(this.temperatureData.length - 8, this.temperatureData.length)
          }
          
          this.$refs.temperatureChart.updateSeries([{
            data: this.temperatureData
          }])
        });
        humRef.limitToLast(1).on('value', querySnapshot => {
          let data = querySnapshot.val();
          let value = Object.values(data)
          if (value.toString() > 50) {
            this.showHumidityAlert = true;
          } else {
            this.showHumidityAlert = false;
          }
          
          this.humidityData.push({ x : this.setTime(), y : value.toString()})
          if (this.humidityData.length > 8) {
            this.humidityData = this.humidityData.slice(this.humidityData.length - 8, this.humidityData.length)
          }
          
          this.$refs.humidityChart.updateSeries([{
            data: this.humidityData
          }])
        });
        coRef.limitToLast(1).on('value', querySnapshot => {
          let data = querySnapshot.val();
          let value = Object.values(data)
          if (value.toString() > 1000) {
            this.showCarbonDioxideAlert = true;
          } else {
            this.showCarbonDioxideAlert = false;
          }
          this.carbonDioxideData.push({ x : this.setTime(), y : value.toString()})
          if (this.carbonDioxideData.length > 8) {
            this.carbonDioxideData = this.carbonDioxideData.slice(this.carbonDioxideData.length - 8, this.carbonDioxideData.length)
          }
          this.$refs.carbonDioxideChart.updateSeries([{
            data: this.carbonDioxideData
          }])
        });
        tvocRef.limitToLast(1).on('value', querySnapshot => {
          let data = querySnapshot.val();
          let value = Object.values(data)
          if (value.toString() > 200) {
            this.showTotalVolatileOrganicCompoundAlert = true;
          } else {
            this.showTotalVolatileOrganicCompoundAlert = false;
          }
          this.totalVolatileOrganicCompoundData.push({ x : this.setTime(), y : value.toString()})
          if (this.totalVolatileOrganicCompoundData.length > 8) {
            this.totalVolatileOrganicCompoundData = this.totalVolatileOrganicCompoundData.slice(this.totalVolatileOrganicCompoundData.length - 8, this.totalVolatileOrganicCompoundData.length)
          }
          
          this.$refs.totalVolatileOrganicChart.updateSeries([{
            data: this.totalVolatileOrganicCompoundData
          }])
        });    
        altitudeRef.limitToLast(1).on('value', querySnapshot => {
          let data = querySnapshot.val();
          let value = Object.values(data)
          this.altitudeData.push({ x : this.setTime(), y : value.toString()})
          if (this.altitudeData.length > 8) {
            this.altitudeData = this.altitudeData.slice(this.altitudeData.length - 8, this.altitudeData.length)
          }
          
          this.$refs.altitudeChart.updateSeries([{
            data: this.altitudeData
          }])
        }); 
        atomospherePressureRef.limitToLast(1).on('value', querySnapshot => {
          let data = querySnapshot.val();
          let value = Object.values(data)
          this.atomospherePressureData.push({ x : this.setTime(), y : value.toString()})
          if (this.atomospherePressureData.length > 8) {
            this.atomospherePressureData = this.atomospherePressureData.slice(this.atomospherePressureData.length - 8, this.atomospherePressureData.length)
          }
          this.$refs.atmosphericPressureChart.updateSeries([{
            data: this.atomospherePressureData
          }])
        }); 
      },
      methods: {
        toggleTemperature(){
          console.log(this.showTemperature)
          this.showTemperature = !this.showTemperature;
        },
        toggleHumidity(){
          console.log(this.showHumidity)
          this.showHumidity = !this.showHumidity;
        },
        toggleCarbonDioxide(){
          console.log(this.showCarbonDioxide)
          this.showCarbonDioxide = !this.showCarbonDioxide;
        },
        toggleTotalVolatileOrganicCompound() {
          console.log(this.showTotalVolatileOrganicCompound)
          this.showTotalVolatileOrganicCompound = !this.showTotalVolatileOrganicCompound;
        },
        toggleAltitude() {
          console.log(this.showAltitude)
          this.showAltitude = !this.showAltitude
        },
        toggleAtmosphericPressure() {
          console.log(this.showAtmosphericPressure)
          this.showAtmosphericPressure = !this.showAtmosphericPressure
        },
        setTime() {
          var date = new Date()
          var hours = date.getHours()
          var minutes = date.getMinutes()
          var seconds = date.getSeconds()
          if (seconds < 10) {
            seconds = "0" + seconds.toString()
          }
          
          if (minutes < 10) {
            minutes = "0" + minutes.toString()
          }
          if (hours < 10) {
            hours = "0" +  hours.toString()
          }
          return hours + ":" + minutes + ":" + seconds
        }
      }
    }

    )
  }

  return (

  );
}

export default App;
