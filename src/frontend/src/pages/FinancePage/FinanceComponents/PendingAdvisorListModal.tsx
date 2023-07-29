import { Controller, useForm } from 'react-hook-form';
import { useToast } from '../../../hooks/toasts.hooks';
import { useSendPendingAdvisorList } from '../../../hooks/finance.hooks';
import LoadingIndicator from '../../../components/LoadingIndicator';
import NERFormModal from '../../../components/NERFormModal';
import { Box } from '@mui/system';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';

const schema = yup.object().shape({
  saboNumbers: yup.array().of(yup.number().required('SABO Number is required')).required('SABO Numbers are required')
});

interface PendingAdvisorModalProps {
  open: boolean;
  saboNumbers: number[];
  onHide: () => void;
}
const PendingAdvisorModal: React.FC<PendingAdvisorModalProps> = ({ open, saboNumbers, onHide }) => {
  const { mutateAsync: sendPendingAdvisorList, isLoading: sendPendingAdvisorListIsLoading } = useSendPendingAdvisorList();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      saboNumbers: saboNumbers
    }
  });

  const toast = useToast();

  if (sendPendingAdvisorListIsLoading) return <LoadingIndicator />;

  const onSubmit = async (data: { saboNumbers: number[] }) => {
    try {
      await sendPendingAdvisorList(data.saboNumbers);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Custom input component for the TextField
  const CommaSeparatedNumbersInput = ({
    value,
    onChange
  }: {
    value: number[];
    onChange: (saboNumbers: number[]) => void;
  }) => {
    const [inputValue, setInputValue] = useState<string>(value.join(', '));

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const inputValue = e.target.value;
      setInputValue(inputValue);

      // Split the input string by commas and parse each number
      const saboNumbers = inputValue
        .split(',')
        .map((saboNumber) => parseInt(saboNumber.trim()))
        .filter((num) => !isNaN(num)); // Filter out NaN values

      onChange(saboNumbers);
    };

    return (
      <TextField
        value={inputValue}
        onChange={handleChange}
        label="SABO Numbers"
        multiline
        rows={4}
        fullWidth
        error={!!errors.saboNumbers}
        helperText={errors.saboNumbers?.message}
      />
    );
  };

  return (
    <NERFormModal
      open={open}
      title="Pending Advisors"
      submitText="Send To Advisor"
      onHide={onHide}
      handleUseFormSubmit={handleSubmit}
      onFormSubmit={onSubmit}
      formId="pending-advisor-form"
      reset={reset}
      cancelText="Cancel"
    >
      <Box sx={{ border: 'black' }}>
        <Controller
          control={control}
          name="saboNumbers"
          render={({ field }) => <CommaSeparatedNumbersInput value={field.value} onChange={field.onChange} />}
        />
      </Box>
    </NERFormModal>
  );
};

export default PendingAdvisorModal;
