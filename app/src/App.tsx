import { FC, useCallback, useState } from 'react';
import { FirebaseService } from './firebase/firebase';
import { useFetch } from './firebase/useFetch';
import { Flex, Text, Button, Input, Accordion, Heading } from '@chakra-ui/react';
import { Session } from './components/Session';
import { Models } from 'firebase/models';

type Status = 'success' | 'error' | 'none';

const App: FC = () => {
  const [temp, setTemp] = useState<string>('');
  const [status, setStatus] = useState<Status>('none');
  const [isLoading, setIsLoading] = useState(false);
  const { data: target } = useFetch<Models.Target>(FirebaseService.getTarget, []);
  const { data: sessions } = useFetch<Array<Models.Session>>(FirebaseService.getSessions, []);

  const onConfirm = useCallback(() => {
    setIsLoading(true);
    return FirebaseService.updateTargetTemperature(target.id, +temp)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
      .finally(() => setIsLoading(false));
  }, [temp, target?.id]);

  return (
    <div>
      <Heading m="20px">Monitorowanie procesu grzewczego rezystora</Heading>
      <Flex gap="2" m="20px" lineHeight="40px">
        <Text>Wprowadź zadaną temperaturę</Text>
        <Input
          width={200}
          onChange={(e) => setTemp(e.target.value)}
          min={10}
          defaultValue={20}
          max={50}
          type="number"
        />
        <Button onClick={onConfirm} disabled={isLoading} colorScheme="facebook">
          Potwierdź
        </Button>
        {status === 'success' && <Text color="green">Zmieniono temperaturę pomyślnie</Text>}
        {status === 'error' && <Text color="red">Wystąpił błąd podczas zmiany temeratury</Text>}
      </Flex>
      <Accordion mx="20px" allowToggle>
        {sessions?.map((session) => <Session key={session.id} {...session} />)}
      </Accordion>
    </div>
  );
};

export default App;
