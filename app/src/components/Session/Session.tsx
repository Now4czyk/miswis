import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box } from '@chakra-ui/react';
import { Models } from 'firebase/firebase';
import { FC } from 'react';
import { Chart } from '../Chart';

export interface Sess {
  id: string;
  timestamp: string;
}

export const Session: FC<Models.Session> = (session) => {
  return (
    <AccordionItem>
      {({ isExpanded }) => (
        <>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Sesja {session.timestamp} ({session.id})
            </Box>
            <AccordionIcon />
          </AccordionButton>
          {isExpanded && (
            <AccordionPanel pb={4}>
              <Chart id={session.id} />
            </AccordionPanel>
          )}
        </>
      )}
    </AccordionItem>
  );
};
