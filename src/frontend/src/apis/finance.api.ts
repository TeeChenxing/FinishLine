/*
 * This file is part of NER's FinishLine and licensed under GNU AGPLv3.
 * See the LICENSE file in the repository root folder for details.
 */
import axios from '../utils/axios';
import { apiUrls } from '../utils/urls';

/**
 * Upload a picture of a receipt
 *
 * @param payload Payload containing the image data
 */
export const uploadSingleReceipt = (formData: FormData, id: string) => {
  return axios.post(apiUrls.financeUploadRceipt(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

/**
 * Gets a single reimbursement request with the given id
 *
 * @param id The id of the reimbursement request to get
 * @returns The requested reimbursement request
 */
export const getSingleReimbursementRequest = (id: string) => {
  return axios.get(apiUrls.financeReimbursementRequestById(id));
};
