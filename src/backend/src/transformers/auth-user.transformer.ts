import { Prisma } from '@prisma/client';
import { AuthenticatedUser } from 'shared';
import authUserQueryArgs from '../prisma-query-args/auth-user.query-args';

const authenticatedUserTransformer = (user: Prisma.UserGetPayload<typeof authUserQueryArgs>): AuthenticatedUser => {
  return {
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    emailId: user.emailId,
    role: user.role,
    defaultTheme: user.userSettings?.defaultTheme,
    teamAsHeadId: user.teamAsHead?.teamId,
    favoritedProjectsId: user.favoriteProjects.map((project) => project.projectId)
  };
};

export default authenticatedUserTransformer;
