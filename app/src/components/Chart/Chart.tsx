import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useFetch } from '../../firebase/useFetch';
import { FirebaseService, Models } from '../../firebase/firebase';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { Box } from '@chakra-ui/react';

export const Chart: FC<{ id: string }> = ({ id }) => {
  const { data: temperatures, reload } = useFetch<Array<Models.Temperature>>(
    () => FirebaseService.getSessionTemperatures(id),
    [id]
  );

  const data = useMemo(
    () => ({
      labels: temperatures?.map(({ temperature }) => temperature),
      datasets: [
        {
          label: 'Temperatura',
          data: temperatures
            ?.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map(({ temperature }) => temperature)
        }
      ]
    }),
    [temperatures]
  );

  useEffect(() => {
    const intervalID = setInterval(reload, 2000);
    return () => clearInterval(intervalID);
  });

  return (
    <Box height={300}>
      <Line
        data={data}
        options={{
          aspectRatio: 1
          // animations
        }}
      />
    </Box>
  );
};
