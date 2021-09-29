import React, { useState } from 'react';
import { Button, Card, Modal } from 'antd';
import { Line } from "react-chartjs-2";

const TemperatureData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
        {
            data: [33, 53, 85, 41, 44, 65],
            fill: true,
            backgroundColor: "rgba(75,192,192,0.2)",
            borderColor: "rgba(75,192,192,1)"
        },
    ],
};
  
export const DashboardModal = () => {
  const [visible, setVisible] = useState(false);
  const [temperatureData, setTemperatureData] = useState(TemperatureData);
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
        <Card title="Temperature" style={{ width: '50%' }}>
            <Line data={temperatureData} options={{plugins: { legend: {display: false,},}}} />
        </Card>
        <div style={{ display: 'flex' }}>
            <Card title="Humidity" style={{ width: '50%' }}>
                <Line data={temperatureData} options={{plugins: { legend: {display: false,},}}} />
            </Card>
            <Card title="Particulate Matter" style={{ width: '50%' }}>
                <Line data={temperatureData} options={{plugins: { legend: {display: false,},}}} />
            </Card>
        </div>
      </Modal>
    </>
  );
};