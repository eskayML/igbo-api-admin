import React, { ReactElement, useEffect, useState } from 'react';
import {
  Box,
  IconButton,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import { Input } from 'src/shared/primitives';
import network from 'src/utils/dataProvider';
import Collection from 'src/shared/constants/Collections';
import { Controller } from 'react-hook-form';
import AudioRecorder from '../../../../AudioRecorder';
import ExamplesInterface from './ExamplesInterface';
import NsibidiInput from '../../NsibidiForm/NsibidiInput';

const Example = ({
  example,
  index,
  remove,
  control,
  setValue,
}: ExamplesInterface): ReactElement => {
  const [originalRecord, setOriginalRecord] = useState(null);
  const {
    igbo = '',
    english = '',
    meaning = '',
    pronunciation = '',
    nsibidi = '',
    exampleId = '',
    associatedWords = [],
    originalExampleId,
  } = example;
  const [isExistingExample, setIsExistingExample] = useState(!!originalExampleId);
  const deleteMessage = isExistingExample
    ? `This is an existing example suggestion that is being updated. Clicking this button will NOT
    permanently delete the example sentence, rather it will be archived (saved) but hidden.`
    : 'This is a new example suggestion. Clicking this button will delete it permanently.';

  useEffect(() => {
    setIsExistingExample(!!originalExampleId);
  }, [example]);

  useEffect(() => {
    (async () => {
      setOriginalRecord(
        originalExampleId
          ? await network.getOne(Collection.EXAMPLES, { id: originalExampleId })
          : example,
      );
    })();
  }, []);

  return originalRecord ? (
    <Box className="list-container" key={`${exampleId}-${igbo}-${english}`}>
      <Box
        data-example-id={exampleId}
        data-original-example-id={originalExampleId}
        data-associated-words={associatedWords}
        className="flex flex-col w-full space-y-3"
      >
        <Controller
          render={(props) => (
            <input
              {...props}
              style={{ opacity: 0, pointerEvents: 'none', position: 'absolute' }}
              data-test={`examples-${index}-igbo-id`}
            />
          )}
          name={`examples.${index}.exampleId`}
          defaultValue={exampleId}
          control={control}
        />
        <h3 className="text-gray-700">Igbo:</h3>
        <Controller
          render={(props) => (
            <Input
              {...props}
              placeholder="Example in Igbo"
              data-test={`examples-${index}-igbo-input`}
            />
          )}
          name={`examples.${index}.igbo`}
          defaultValue={igbo}
          control={control}
        />
        <h3 className="text-gray-700">English:</h3>
        <Controller
          render={(props) => (
            <Input
              {...props}
              placeholder="Example in English (literal)"
              data-test={`examples-${index}-english-input`}
            />
          )}
          name={`examples.${index}.english`}
          defaultValue={english}
          control={control}
        />
        <h3 className="text-gray-700">Meaning:</h3>
        <Controller
          render={(props) => (
            <Input
              {...props}
              placeholder="Example in English (meaning)"
              data-test={`examples-${index}-meaning-input`}
            />
          )}
          name={`examples.${index}.meaning`}
          defaultValue={meaning}
          control={control}
        />
        <h3 className="text-gray-700">Nsịbịdị:</h3>
        <Controller
          render={(props) => (
            <NsibidiInput
              {...props}
              placeholder="Example in Nsịbịdị"
              data-test={`examples-${index}-nsibidi-input`}
              nsibidiFormName={`examples.${index}.nsibidiCharacters`}
              control={control}
            />
          )}
          name={`examples.${index}.nsibidi`}
          defaultValue={nsibidi}
          control={control}
        />
        <input
          style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }}
          name={`examples.${index}.pronunciation`}
          ref={control.register}
          defaultValue={pronunciation}
        />
        <AudioRecorder
          path="pronunciation"
          getFormValues={() => control.getValues(`examples.${index}.pronunciation`)}
          setPronunciation={(_, value) => setValue(`examples.${index}.pronunciation`, value)}
          record={example}
          originalRecord={originalRecord}
          formTitle="Igbo Sentence Recording"
          formTooltip="Record the audio for the Igbo example sentence only one time.
          You are able to record over pre-existing recordings."
        />
      </Box>
      <Tooltip label={deleteMessage}>
        <IconButton
          backgroundColor={isExistingExample ? 'orange.100' : 'red.100'}
          _hover={{
            backgroundColor: isExistingExample ? 'orange.200' : 'red.200',
          }}
          aria-label={isExistingExample ? 'Archive Example' : 'Delete Example'}
          onClick={() => remove(index)}
          className="ml-3"
          icon={isExistingExample ? (() => <>🗄</>)() : (() => <>🗑</>)()}
        />
      </Tooltip>
    </Box>
  ) : <Spinner />;
};

export default Example;
