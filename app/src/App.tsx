import { FC } from 'react';
import { Button, Flex, Text } from '@radix-ui/themes';
import { Input } from './components/Input';

const App: FC = () => {
  return (
    <div>
      <Flex>
        <Text>Wprowadź zadaną temperaturę</Text>
        <Input />
        <Button>Potwierdź</Button>
      </Flex>
    </div>
  );
};

export default App;
