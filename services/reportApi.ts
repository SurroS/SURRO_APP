import { authenticatedPost } from "./httpClient";

export interface ReportUnresponsiveRequest {
  targetUserId: string;
  reason: string;
  reasonDetail?: string;
}

export interface ReportUnresponsiveResponse {
  success: boolean;
  reportId: string;
  message: string;
}

export const reportUnresponsiveUser = (
  data: ReportUnresponsiveRequest,
): Promise<ReportUnresponsiveResponse> =>
  authenticatedPost("/reports/unresponsive", data);
