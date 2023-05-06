import { NextFunction, Request, Response } from 'express';
import { getCurrentUser } from '../utils/auth.utils';
import ReimbursementRequestService from '../services/reimbursement-requests.services';

export default class ReimbursementRequestController {
  static async createReimbursementRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { dateOfExpense, vendorId, account, receiptPictures, reimbursementProducts, expenseTypeId, totalCost } =
        req.body;
      const user = await getCurrentUser(res);
      const createdReimbursementRequestId = await ReimbursementRequestService.createReimbursementRequest(
        user,
        dateOfExpense,
        vendorId,
        account,
        receiptPictures,
        reimbursementProducts,
        expenseTypeId,
        totalCost
      );
      res.status(200).json(createdReimbursementRequestId);
    } catch (error: unknown) {
      next(error);
    }
  }

  static async sendPendingAdvisorList(req: Request, res: Response, next: NextFunction) {
    try {
      const { saboNumbers } = req.body;
      const user = await getCurrentUser(res);
      await ReimbursementRequestService.sendPendingAdvisorList(user, saboNumbers);
      res.status(200).json({ message: 'Successfully sent pending advisor list' });
    } catch (error: unknown) {
      next(error);
    }
  }

  static async addSaboNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { saboNumber } = req.body;
      const user = await getCurrentUser(res);
      await ReimbursementRequestService.addSaboNumber(id, saboNumber, user);
      res.status(200).json({ message: 'Successfully added sabo number' });
    } catch (error: unknown) {
      next(error);
    }
  }
}