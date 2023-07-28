import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import NERFormModal from '../../components/NERFormModal';
import ReactHookTextField from '../../components/ReactHookTextField';

interface AddSABONumberModalProps {
  modalShow: boolean;
  onHide: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const AddSABONumberModal = ({ modalShow, onHide, onSubmit }: AddSABONumberModalProps) => {
  const schema = yup.object().shape({ saboNumber: yup.number().required() });

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      saboNumber: ''
    },
    mode: 'onChange'
  });

  return (
    <NERFormModal
      open={modalShow}
      onHide={onHide}
      title="Add SABO Number"
      reset={reset}
      handleUseFormSubmit={handleSubmit}
      onFormSubmit={onSubmit}
      disabled={!isValid}
      formId="add-sabo-number"
    >
      <FormControl>
        <ReactHookTextField
          control={control}
          name="saboNumber"
          errorMessage={errors.saboNumber}
          placeholder="12345"
          sx={{ width: 1 }}
          type="number"
        />
      </FormControl>
    </NERFormModal>
  );
};

export default AddSABONumberModal;
