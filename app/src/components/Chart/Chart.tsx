import { FC, useEffect, useMemo } from 'react';
import { useFetch } from '../../firebase/useFetch';
import { FirebaseService } from '../../firebase/firebase';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';
import { Models } from 'firebase/models';

export const Chart: FC<{ id: string }> = ({ id }) => {
  const { data: temperatures, reload } = useFetch<Array<Models.Temperature>>(
    () => FirebaseService.getSessionTemperatures(id),
    [id]
  );
  useEffect(() => {
    const interval = setInterval(reload, 5000);
    return () => clearInterval(interval);
  });

  const data = useMemo(
    () => ({
      labels: temperatures?.map((_, index) => index + 1),
      datasets: [
        {
          label: 'Temperatura dla kolejnych próbek',
          data: temperatures
            ?.sort((a, b) => new Date(a.id).getTime() - new Date(b.id).getTime())
            .map(({ temperature }) => temperature),
          yAxisID: 'y',
          xAxisID: 'x'
        }
      ]
    }),
    [temperatures]
  );

  const options = useMemo(
    () => ({
      scales: {
        x: {
          title: {
            display: true,
            text: 'Numer próbki'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Temperatura [°C]'
          }
        }
      }
    }),
    []
  );

  return (
    <Box height={400}>
      <Line data={data} options={options} />
    </Box>
  );
};
