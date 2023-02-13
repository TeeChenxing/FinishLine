import request from 'supertest';
import prisma from '../src/prisma/prisma';
import { getHighestProjectNumber, projectTransformer } from '../src/utils/projects.utils';
import * as changeRequestUtils from '../src/utils/change-requests.utils';
import { aquaman, batman, wonderwoman } from './test-data/users.test-data';
import { project1 } from './test-data/projects.test-data';
import { prismaChangeRequest1 } from './test-data/change-requests.test-data';
import { prismaTeam1 } from './test-data/teams.test-data';
import ProjectsService from '../src/services/projects.services';
import { prismaWbsElement1 } from './test-data/wbs-element.test-data';

//jest.mock('../src/utils/projects.utils');
//const mockGetHighestProjectNumber = getHighestProjectNumber as jest.Mock<Promise<number>>;
//const mockProjectTransformer = projectTransformer as jest.Mock;

describe('Projects', () => {
  beforeEach(() => {
    /*jest.spyOn(changeRequestUtils, 'validateChangeRequestAccepted').mockImplementation(async (_crId) => {
      return prismaChangeRequest1;
    });*/
    jest.spyOn(projectUtils, 'hasProjectPermissions').mockResolvedValue(true);
    jest.spyOn(projectTransformer, 'default').mockReturnValue(sharedProject1);
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as string);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /*test('newProject fails with invalid userId', async () => {
    const proj = { ...newProjectPayload, userId: -1 };
    const res = await request(app).post('/new').send(proj);
    expect(res.statusCode).toBe(400);
  });

  test('newProject fails with invalid crId', async () => {
    const proj = { ...newProjectPayload, crId: 'asdf' };
    const res = await request(app).post('/new').send(proj);
    expect(res.statusCode).toBe(400);
  });

  test('newProject fails with invalid name', async () => {
    const proj = { ...newProjectPayload, name: '' };
    const res = await request(app).post('/new').send(proj);
    expect(res.statusCode).toBe(400);
  });

  test('newProject fails when unknown team Id provided', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(batman);
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
    const proj = { ...newProjectPayload, teamId: 'TEST' };
    const res = await request(app).post('/new').send(proj);
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({ message: `team with id TEST not found.` });
  });*/

  test('createProject works', async () => {
    const { teamId, wbsElement, summary } = project1;
    const { carNumber, name } = wbsElement;
    const crId = 10;
    //mockGetHighestProjectNumber.mockResolvedValue(0);
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(batman);
    jest.spyOn(prisma.wBS_Element, 'create').mockResolvedValue({
      ...prismaWbsElement1
      /*wbsElementId: 1,
      status: 'ACTIVE',
      carNumber: 1,
      projectNumber: 2,
      workPackageNumber: 3,
      dateCreated: new Date(),
      dateDeleted: null,
      deletedByUserId: null,
      name: 'car',
      projectLeadId: 4,
      projectManagerId: 5*/
    });

    const wbsString = await ProjectsService.createProject(batman, teamId, carNumber, name, summary, crId);

    expect(wbsString).toStrictEqual(
      `${prismaWbsElement1.carNumber}.${prismaWbsElement1.projectNumber}.${prismaWbsElement1.workPackageNumber}`
    );
    expect(prisma.user.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.wBS_Element.create).toHaveBeenCalledTimes(1);
  });

  test('getSingleProject works', async () => {
    const { wbsElement } = project1;
    jest.spyOn(prisma.wBS_Element, 'findFirst').mockResolvedValue(wbsElement);
    mockProjectTransformer.mockReturnValue({ message: 'projectTransformer called' });

    const project = await ProjectsService.getSingleProject(wbsElement);

    expect(project).toStrictEqual(project1);
    expect(prisma.wBS_Element.findFirst).toHaveBeenCalledTimes(1);
    expect(res.body).toStrictEqual({ message: 'projectTransformer called' });
  });

  test('getAllProjects works', async () => {
    jest.spyOn(prisma.project, 'findMany').mockResolvedValue([]);
    expect(prisma.project.findMany).toHaveBeenCalledTimes(1);
    expect(res.body).toStrictEqual([]);
  });

  /*test('editProject fails with feature with no detail', async () => {
    const proj = { ...editProjectPayload, features: [{ id: 4 }] };
    const res = await request(app).post('/edit').send(proj);
    expect(res.statusCode).toBe(400);
  });

  test('editProject fails with feature with invalid id', async () => {
    const proj = { ...editProjectPayload, features: [{ id: -1, detail: 'alsdjf' }] };
    const res = await request(app).post('/edit').send(proj);
    expect(res.statusCode).toBe(400);
  });

  test('editProject fails with feature with invalid detail', async () => {
    const proj = { ...editProjectPayload, features: [{ id: 4, detail: '' }] };
    const res = await request(app).post('/edit').send(proj);
    expect(res.statusCode).toBe(400);
  });

  test('getSingleProject fails given invalid project wbs number', async () => {
    let res = await request(app).get('/1.0.1');
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({ message: `1.0.1 is not a valid project WBS #!` });
    res = await request(app).get('/2.0.2');
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({ message: `2.0.2 is not a valid project WBS #!` });
  });

  test('getSingleProject fails when associated wbsElement doesnt exist', async () => {
    jest.spyOn(prisma.wBS_Element, 'findUnique').mockResolvedValue(null);
    let res = await request(app).get('/1.3.0');
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({ message: 'project 1.3.0 not found!' });
    res = await request(app).get('/2.4.0');
    expect(res.statusCode).toBe(404);
    expect(res.body).toStrictEqual({ message: 'project 2.4.0 not found!' });
  });*/

  /*test('setProjectTeam fails given invalid project wbs number', async () => {
    const res = await request(app).post('/1.0.1/set-team').send({ teamId: 'test' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toStrictEqual({ message: `1.0.1 is not a valid project WBS #!` });
  });

  test('setProjectTeam fails with invalid team id', async () => {
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
    const res = await request(app).post('/1.2.0/set-team').send({ teamId: 123 });
    expect(res.statusCode).toBe(400);
  });

  test('setProjectTeam fails with team that does not exist', async () => {
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(project1);
    const res = await request(app).post('/1.2.0/set-team').send({ teamId: 'test' });
    expect(res.statusCode).toBe(404);
  });

  test('setProjectTeam fails with no permission from submitter (guest)', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(wonderwoman);
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(prismaTeam1);
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(project1);
    const res = await request(app).post('/1.2.0/set-team').send({ teamId: 'test' });
    expect(res.statusCode).toBe(403);
  });

  test('setProjectTeam fails with no permission from submitter (leadership)', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(aquaman);
    jest.spyOn(prisma.team, 'findUnique').mockResolvedValue(prismaTeam1);
    jest.spyOn(prisma.project, 'findFirst').mockResolvedValue(project1);
    const res = await request(app).post('/1.2.0/set-team').send({ teamId: 'test' });
    expect(res.statusCode).toBe(403);
  });*/
});
