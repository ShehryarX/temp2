import React, { useMemo, useState } from 'react';
import { Button, Card, Modal } from 'antd';
import { Line } from "react-chartjs-2";
import { ref, get, child, onValue } from 'firebase/database'
import { db } from "../temp.js";

// get(db, `current/GRD_0001/`).then((snapshot) => {
//   if (snapshot.exists()) {
//     console.log(snapshot.val());
//   } else {
//     console.log("No data available");
//   }
// }).catch((error) => {
//   console.error(error);
// });

const aa = ref(db);

const TemperatureData = {
  labels: [],
  datasets: [
      {
          data: [],
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)"
      },
  ],
};
const HumdityData = {
  labels: [],
  datasets: [
      {
          data: [],
          fill: true,
          backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: "rgba(75,192,192,1)"
      },
  ],
};

  
export const DashboardModal = () => {
  const [visible, setVisible] = useState(false);
  const [temperatureData, setTemperatureData] = useState(TemperatureData);
  const [humidityData, setHumidityData] = useState(HumdityData);
  let temp = [];
  let humidity = [];
  let epochData = [];
  useMemo(() => {
    setInterval(() => {
      console.log("NOW!");
      get(child(aa, 'current/GRD_0001/')).then((snapshot) => {
        if (snapshot.exists()) {
          temp.push(snapshot.val()['temp']);
          humidity.push(snapshot.val()['humidity']);
          epochData.push(snapshot.val()['epoch_time']);
          if (temp.length >= 10) {
            temp.shift();
            epochData.shift();
            humidity.shift();
          }
        } else {
          console.log("No data available");
        }
      })

      setTemperatureData({
        labels: epochData,
        datasets: [
            {
                data: temp,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            },
        ],
      })
      const copy = [];
      for (const a of epochData) {
        copy.push(a);
      }
      setHumidityData({
        labels: copy,
        datasets: [
            {
                data: humidity,
                fill: true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)"
            },
        ],
      })
    }, 2000);
  }, [])
 

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Beacon Information
      </Button>
      <Modal
        title={`Beacon BEACON_NAME`}
        centered
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <Card title="Temperature" style={{ width: '100%' }}>
            <Line data={temperatureData} options={{plugins: { legend: {display: false,},}}} />
        </Card>
        <Card title="Humidity" style={{ width: '100%' }}>
            <Line data={humidityData} options={{plugins: { legend: {display: false,},}}} />
        </Card>
      </Modal>
    </>
  );
};