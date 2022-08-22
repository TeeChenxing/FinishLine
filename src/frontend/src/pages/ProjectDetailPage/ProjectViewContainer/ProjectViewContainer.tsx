/*
 * This file is part of NER's PM Dashboard and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */

import { Container, Dropdown, DropdownButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { WorkPackage, Project } from 'shared';
import { wbsPipe } from '../../../utils/Pipes';
import { useAuth } from '../../../hooks/Auth.hooks';
import ChangesList from '../../../components/ChangesList';
import DescriptionList from '../../../components/DescriptionList';
import WorkPackageSummary from './WorkPackageSummary';
import PageTitle from '../../../layouts/PageTitle/PageTitle';
import PageBlock from '../../../layouts/PageBlock';
import ProjectDetails from './ProjectDetails';
import RulesList from './RulesList';
import RiskLog from './RiskLog';
import { routes } from '../../../utils/Routes';
import ProjectGantt from './ProjectGantt';

interface ProjectViewContainerProps {
  proj: Project;
  enterEditMode: () => void;
}

const ProjectViewContainer: React.FC<ProjectViewContainerProps> = ({ proj, enterEditMode }) => {
  const auth = useAuth();
  proj.workPackages.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const isGuest = auth.user?.role === 'GUEST';
  const editBtn = (
    <Dropdown.Item onClick={enterEditMode} disabled={isGuest}>
      Edit
    </Dropdown.Item>
  );
  const createCRBtn = (
    <Dropdown.Item
      as={Link}
      to={routes.CHANGE_REQUESTS_NEW_WITH_WBS + wbsPipe(proj.wbsNum)}
      disabled={isGuest}
    >
      Request Change
    </Dropdown.Item>
  );
  const projectActionsDropdown = (
    <DropdownButton id="project-actions-dropdown" title="Actions">
      {editBtn}
      {createCRBtn}
    </DropdownButton>
  );

  const testRisks = [
    { details: 'Risk #1', resolved: false },
    { details: 'Risk #2', resolved: true },
    { details: 'Risk #3', resolved: false }
  ];

  return (
    <Container fluid className="mb-5">
      <PageTitle
        title={`${wbsPipe(proj.wbsNum)} - ${proj.name}`}
        previousPages={[{ name: 'Projects', route: routes.PROJECTS }]}
        actionButton={projectActionsDropdown}
      />
      <ProjectDetails project={proj} />
      <PageBlock title={'Summary'}>{proj.summary}</PageBlock>
      <RiskLog risks={testRisks} />
      <ProjectGantt workPackages={proj.workPackages} />
      <DescriptionList title={'Goals'} items={proj.goals.filter((goal) => !goal.dateDeleted)} />
      <DescriptionList
        title={'Features'}
        items={proj.features.filter((feature) => !feature.dateDeleted)}
      />
      <DescriptionList
        title={'Other Constraints'}
        items={proj.otherConstraints.filter((constraint) => !constraint.dateDeleted)}
      />
      <RulesList rules={proj.rules} />
      <ChangesList changes={proj.changes} />
      <PageBlock title={'Work Packages'}>
        {proj.workPackages.map((ele: WorkPackage) => (
          <div key={wbsPipe(ele.wbsNum)} className="mt-3">
            <WorkPackageSummary workPackage={ele} />
          </div>
        ))}
      </PageBlock>
    </Container>
  );
};

export default ProjectViewContainer;
