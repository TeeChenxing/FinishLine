import { Delete } from '@mui/icons-material';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Link,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { Control, Controller, FieldErrors, UseFormHandleSubmit, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  ClubAccount,
  ExpenseType,
  ReimbursementProductCreateArgs,
  ReimbursementReceiptCreateArgs,
  ReimbursementReceiptUploadArgs,
  Vendor,
  WbsNumber,
  wbsPipe
} from 'shared';
import { DatePicker } from '@mui/x-date-pickers';
import ReimbursementProductTable from './ReimbursementProductTable';
import NERFailButton from '../../../components/NERFailButton';
import NERSuccessButton from '../../../components/NERSuccessButton';
import { ReimbursementRequestFormInput } from './ReimbursementRequestForm';
import { useState } from 'react';
import { useToast } from '../../../hooks/toasts.hooks';
import NERAutocomplete from '../../../components/NERAutocomplete';
import { Link as RouterLink } from 'react-router-dom';
import { routes } from '../../../utils/routes';
import { codeAndRefundSourceName, expenseTypePipe } from '../../../utils/pipes';
import { wbsNumComparator } from 'shared/src/validate-wbs';

interface ReimbursementRequestFormViewProps {
  allVendors: Vendor[];
  allExpenseTypes: ExpenseType[];
  receiptFiles: ReimbursementReceiptCreateArgs[];
  allWbsElements: {
    wbsNum: WbsNumber;
    wbsName: string;
  }[];
  control: Control<ReimbursementRequestFormInput, any>;
  reimbursementProducts: ReimbursementProductCreateArgs[];
  receiptAppend: (args: ReimbursementReceiptUploadArgs) => void;
  receiptRemove: (index: number) => void;
  reimbursementProductAppend: (args: ReimbursementProductCreateArgs) => void;
  reimbursementProductRemove: (index: number) => void;
  onSubmit: (data: ReimbursementRequestFormInput) => void;
  handleSubmit: UseFormHandleSubmit<ReimbursementRequestFormInput>;
  errors: FieldErrors<ReimbursementRequestFormInput>;
  watch: UseFormWatch<ReimbursementRequestFormInput>;
  submitText: string;
  previousPage: string;
  setValue: UseFormSetValue<ReimbursementRequestFormInput>;
  hasSecureSettingsSet: boolean;
}

const ReimbursementRequestFormView: React.FC<ReimbursementRequestFormViewProps> = ({
  allVendors,
  allExpenseTypes,
  allWbsElements,
  receiptFiles,
  reimbursementProducts,
  control,
  receiptAppend,
  receiptRemove,
  reimbursementProductAppend,
  reimbursementProductRemove,
  onSubmit,
  handleSubmit,
  errors,
  watch,
  submitText,
  previousPage,
  setValue,
  hasSecureSettingsSet
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const toast = useToast();
  const products = watch(`reimbursementProducts`);
  const calculatedTotalCost = products.reduce((acc, product) => acc + Number(product.cost), 0).toFixed(2);

  const wbsElementAutocompleteOptions = allWbsElements.map((wbsElement) => ({
    label: wbsPipe(wbsElement.wbsNum) + ' - ' + wbsElement.wbsName,
    id: wbsPipe(wbsElement.wbsNum)
  }));

  wbsElementAutocompleteOptions.sort((wbsNum1, wbsNum2) => wbsNumComparator(wbsNum1.id, wbsNum2.id));

  const ReceiptFileInput = () => (
    <FormControl>
      <FormLabel>Receipts</FormLabel>
      <ul>
        {receiptFiles.map((receiptFile, index) => (
          <li key={index}>
            <Stack key={index} direction="row" justifyContent="space-between">
              <Typography>{receiptFile.name}</Typography>
              <IconButton onClick={() => receiptRemove(index)}>
                <Delete />
              </IconButton>
            </Stack>
          </li>
        ))}
      </ul>
    </FormControl>
  );

  const expenseTypesToAutocomplete = (expenseType: ExpenseType): { label: string; id: string } => {
    return { label: expenseTypePipe(expenseType), id: expenseType.expenseTypeId };
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      {!hasSecureSettingsSet && (
        <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={true}>
          <Alert variant="filled" severity="warning">
            Your secure settings must be set to create a reimbursement request, you can set them
            <Link style={{ color: 'blue' }} component={RouterLink} to={routes.SETTINGS}>
              {' '}
              here
            </Link>
            .
          </Alert>
        </Snackbar>
      )}
      <Grid container spacing={2}>
        <Grid item container spacing={2} md={6} xs={12}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <FormLabel>Purchased From</FormLabel>
              <Controller
                name="vendorId"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select onChange={(newValue) => onChange(newValue.target.value)} value={value} error={!!errors.vendorId}>
                    {allVendors
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((vendor) => (
                        <MenuItem key={vendor.vendorId} value={vendor.vendorId}>
                          {vendor.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <FormHelperText error>{errors.vendorId?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormLabel>Refund Source</FormLabel>
              <Controller
                name="account"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    onChange={(newValue) => onChange(newValue.target.value as ClubAccount)}
                    value={value}
                    error={!!errors.account}
                  >
                    {Object.values(ClubAccount).map((account) => (
                      <MenuItem key={account} value={account}>
                        {codeAndRefundSourceName(account)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText error>{errors.account?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <FormLabel>Date of Expense</FormLabel>
              <Controller
                name="dateOfExpense"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    value={value}
                    open={datePickerOpen}
                    onClose={() => setDatePickerOpen(false)}
                    onOpen={() => setDatePickerOpen(true)}
                    onChange={(newValue) => {
                      onChange(newValue ?? new Date());
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{ ...params.inputProps, readOnly: true }}
                        error={!!errors.dateOfExpense}
                        helperText={errors.dateOfExpense?.message}
                        onClick={(e) => setDatePickerOpen(true)}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item container xs={6} spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Expense Type</FormLabel>
                <Controller
                  name="expenseTypeId"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const mappedExpenseTypes = allExpenseTypes.map(expenseTypesToAutocomplete);
                    return (
                      <NERAutocomplete
                        id={'expenseType'}
                        size="medium"
                        options={mappedExpenseTypes}
                        value={mappedExpenseTypes.find((expenseType) => expenseType.id === value) || null}
                        placeholder="Expense Type"
                        onChange={(_event, newValue) => {
                          newValue ? onChange(newValue.id) : onChange('');
                        }}
                      />
                    );
                  }}
                />
                <FormHelperText error>{errors.expenseTypeId?.message}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Total Cost</FormLabel>
              <Typography variant="h6">${calculatedTotalCost}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <ReceiptFileInput />
              <input
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    if (file.size < 1000000) {
                      receiptAppend({
                        file: e.target.files[0],
                        name: e.target.files[0].name,
                        googleFileId: ''
                      });
                    } else {
                      toast.error('File must be less than 1 MB', 5000);
                      document.getElementById('receipt-image')!.innerHTML = '';
                    }
                  }
                }}
                type="file"
                id="receipt-image"
                accept="image/png, image/jpeg, .pdf"
                name="receiptFiles"
              />
              <FormHelperText error>{errors.receiptFiles?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item md={6} xs={12} sx={{ '&.MuiGrid-item': { paddingTop: '4px' } }}>
          <FormControl fullWidth>
            <ReimbursementProductTable
              errors={errors}
              reimbursementProducts={reimbursementProducts}
              appendProduct={reimbursementProductAppend}
              removeProduct={reimbursementProductRemove}
              wbsElementAutocompleteOptions={wbsElementAutocompleteOptions}
              control={control}
              setValue={setValue}
            />
            <FormHelperText error>{errors.reimbursementProducts?.message}</FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <NERFailButton variant="contained" href={previousPage} sx={{ mx: 1 }}>
          Cancel
        </NERFailButton>
        <NERSuccessButton variant="contained" type="submit" disabled={!hasSecureSettingsSet}>
          {submitText}
        </NERSuccessButton>
      </Box>
    </form>
  );
};

export default ReimbursementRequestFormView;
