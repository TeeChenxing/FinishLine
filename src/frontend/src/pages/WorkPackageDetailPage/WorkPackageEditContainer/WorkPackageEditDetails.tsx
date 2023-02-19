/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { User, WbsElementStatus } from 'shared';
import { fullNamePipe } from '../../../utils/pipes';
import PageBlock from '../../../layouts/PageBlock';
import { FormControl, FormLabel, Grid, MenuItem, TextField } from '@mui/material';
import ReactHookTextField from '../../../components/ReactHookTextField';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';

interface Props {
  users: User[];
  control: any;
  errors: any;
}

const statuses = Object.values(WbsElementStatus);

const WorkPackageEditDetails: React.FC<Props> = ({ users, control, errors }) => {
  const statusSelect = (
    <FormControl>
      <FormLabel>Status</FormLabel>
      <Controller
        name="wbsElementStatus"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextField select onChange={onChange} value={value}>
              {statuses.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      />
    </FormControl>
  );

  return (
    <PageBlock title="Work Package Details">
      <Grid container xs={12} sx={{ my: 1 }}>
        <Grid container sx={{ marginBottom: '0.5%' }} gap={'5px'} xs={12}>
          <FormControl sx={{ width: '70%' }}>
            <FormLabel>Work Package Name</FormLabel>
            <ReactHookTextField
              name="name"
              control={control}
              placeholder="Enter work package name..."
              errorMessage={errors.name}
            />
          </FormControl>
          <FormControl sx={{ width: '20%' }}>
            <FormLabel>Start Date (YYYY-MM-DD)</FormLabel>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <>
                  <DatePicker
                    inputFormat="yyyy-MM-dd"
                    onChange={onChange}
                    className={'padding: 10'}
                    value={value}
                    renderInput={(params) => <TextField autoComplete="off" {...params} />}
                  />
                </>
              )}
            />
          </FormControl>
          {statusSelect}
        </Grid>
        <Grid container sx={{ marginBottom: '0.5%' }} gap={'5px'} xs={12}>
          <FormControl sx={{ width: '40%' }}>
            <FormLabel>Project Lead</FormLabel>
            <Controller
              name="projectLead"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField select onChange={onChange} value={value} fullWidth>
                    {users.map((t) => (
                      <MenuItem key={t.userId} value={t.userId}>
                        {fullNamePipe(t)}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            />
          </FormControl>
          <FormControl sx={{ width: '40%' }}>
            <FormLabel>Project Manager</FormLabel>
            <Controller
              name="projectManager"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <>
                  <TextField select onChange={onChange} value={value} fullWidth>
                    {users.map((t) => (
                      <MenuItem key={t.userId} value={t.userId}>
                        {fullNamePipe(t)}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} sx={{ mt: 2, mb: 1 }}>
          <FormControl>
            <FormLabel>Duration</FormLabel>
            <ReactHookTextField
              name="duration"
              control={control}
              type="number"
              placeholder="Enter duration..."
              sx={{ width: '140%' }}
              errorMessage={errors.budget}
            />
          </FormControl>
        </Grid>
      </Grid>
    </PageBlock>
  );
};

export default WorkPackageEditDetails;
