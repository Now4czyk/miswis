import { FC, useCallback, useState } from 'react';
import { FirebaseService, Models } from './firebase/firebase';
import { useFetch } from './firebase/useFetch';
import { Flex, Text, Button, Input, Accordion } from '@chakra-ui/react';
import { Session } from './components/Session';

const App: FC = () => {
  const { data: target } = useFetch<Models.Target>(FirebaseService.getTarget, []);
  const { data: sessions } = useFetch<Array<Models.Session>>(FirebaseService.getSessions, []);

  const [temp, setTemp] = useState<string>('');

  const onConfirm = useCallback(() => FirebaseService.updateTargetTemperature(target.id, +temp), [temp, target?.id]);

  return (
    <div>
      <Flex gap="2" m="20px" lineHeight="40px">
        <Text>Wprowadź zadaną temperaturę</Text>
        <Input width={200} onChange={(e) => setTemp(e.target.value)} placeholder="Basic usage" />
        <Button onClick={onConfirm}>Potwierdź</Button>
      </Flex>
      <Accordion mx="20px" allowToggle>
        {sessions?.map((session) => <Session key={session.id} {...session} />)}
      </Accordion>
    </div>
  );
};

export default App;
