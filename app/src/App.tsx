import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FirebaseService } from './firebase/firebase';
import { useFetch } from './firebase/useFetch';
import {
  Flex,
  Text,
  Button,
  Input,
  Accordion,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react';
import { Session } from './components/Session';
import { Models } from 'firebase/models';

type Status = 'success' | 'error' | 'none';

const App: FC = () => {
  const [temp, setTemp] = useState<string>('20.0');
  const [status, setStatus] = useState<Status>('none');
  const [isLoading, setIsLoading] = useState(false);
  const { data: target, reload } = useFetch<Models.Target>(FirebaseService.getTarget, []);
  const { data: sessions } = useFetch<Array<Models.Session>>(FirebaseService.getSessions, []);

  const onConfirm = useCallback(() => {
    setIsLoading(true);

    return FirebaseService.updateTargetTemperature(target.id, +temp)
      .then(() => {
        reload();
        setStatus('success');
      })
      .catch(() => setStatus('error'))
      .finally(() => setIsLoading(false));
  }, [temp, target?.id]);

  return (
    <div>
      <Heading m="20px">Monitorowanie procesu grzewczego rezystora</Heading>
      <Text m="20px">Zadana temperatura {target?.temperature}</Text>
      <Flex gap="2" m="20px" lineHeight="40px">
        <Text>Zadaj temperaturę</Text>
        <NumberInput defaultValue={20.0} step={0.1} min={10} max={50} onChange={(e) => setTemp(e)}>
          <NumberInputField width={200} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button onClick={onConfirm} disabled={isLoading} colorScheme="facebook">
          Potwierdź
        </Button>
        {status === 'success' && <Text color="green">Zmieniono temperaturę pomyślnie</Text>}
        {status === 'error' && <Text color="red">Wystąpił błąd podczas zmiany temperatury</Text>}
      </Flex>
      <Accordion mx="20px" allowToggle>
        {sessions?.sort((a, b) => (a.id < b.id ? 1 : -1)).map((session) => <Session key={session.id} {...session} />)}
      </Accordion>
    </div>
  );
};

export default App;
