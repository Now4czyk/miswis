import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { FC } from 'react';
import { Chart } from '../Chart';
import { Models } from 'firebase/models';

export const Session: FC<Models.Session> = (session) => {
  const date = new Date(Number(session.id) * 1000);

  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Sesja {`${date.toLocaleDateString()} ${date.getUTCHours()}:${date.getMinutes()}:${date.getSeconds()}`}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>{isExpanded && <Chart id={session.id} />}</AccordionPanel>
        </>
      )}
    </AccordionItem>
  );
};
