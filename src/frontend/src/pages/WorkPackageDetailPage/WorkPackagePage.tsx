/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { useState } from 'react';
import { isAdmin, isGuest, WbsNumber } from 'shared';
import { useSingleWorkPackage } from '../../hooks/work-packages.hooks';
import { useAuth } from '../../hooks/auth.hooks';
import LoadingIndicator from '../../components/LoadingIndicator';
import ErrorPage from '../ErrorPage';
import WorkPackageEditContainer from './WorkPackageEditContainer/WorkPackageEditContainer';
import WorkPackageViewContainer from './WorkPackageViewContainer/WorkPackageViewContainer';
import { useQuery } from '../../hooks/utils.hooks';
import { useHistory } from 'react-router-dom';

interface WorkPackagePageProps {
  wbsNum: WbsNumber;
}

const WorkPackagePage: React.FC<WorkPackagePageProps> = ({ wbsNum }) => {
  const history = useHistory();
  const query = useQuery();
  const { isLoading, isError, data, error } = useSingleWorkPackage(wbsNum);
  const [editMode, setEditMode] = useState<boolean>(query.get('edit') === 'true');
  const auth = useAuth();

  if (isLoading || !auth.user) return <LoadingIndicator />;
  if (isError) return <ErrorPage message={error?.message} />;

  if (editMode) {
    return (
      <WorkPackageEditContainer
        workPackage={data!}
        exitEditMode={() => {
          setEditMode(false);
          history.push(`${history.location.pathname}`);
        }}
        // projectManager={auth.user.firstName}
        // projectLead={auth.user.firstName}
        // setPM={}
        // setPL={}
      />
    );
  }

  return (
    <WorkPackageViewContainer
      workPackage={data!}
      enterEditMode={() => setEditMode(true)}
      allowEdit={!isGuest(auth.user.role)}
      allowActivate={!isGuest(auth.user.role)}
      allowStageGate={!isGuest(auth.user.role)}
      allowRequestChange={!isGuest(auth.user.role)}
      allowDelete={isAdmin(auth.user.role)}
    />
  );
};

export default WorkPackagePage;
