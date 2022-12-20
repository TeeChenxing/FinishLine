import { NextFunction, Request, Response } from 'express';
import TeamsService from '../services/teams.services';
import { getCurrentUser } from '../utils/utils';

export default class TeamsController {
  static async getAllTeams(_req: Request, res: Response, next: NextFunction) {
    try {
      const teams = await TeamsService.getAllTeams();

      return res.status(200).json(teams);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async getSingleTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { teamId } = req.params;

      const team = await TeamsService.getSingleTeam(teamId);

      return res.status(200).json(team);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async setMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { userIds } = req.body;
      const submitter = await getCurrentUser(res);

      // update the team with the input fields
      const updateTeam = await TeamsService.updateSingleTeam(submitter, req.params.teamId, userIds);

      // return the updaetd team
      return res.status(200).json(updateTeam);
    } catch (error: unknown) {
      next(error);
    }
  }
}
