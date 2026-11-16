import { authenticatedGet, authenticatedPost } from "./httpClient";

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
  authenticatedPost("/reports/unresponsive", data).catch((error: any) => {
    if (error?.status !== 404 && error?.response?.status !== 404) throw error;
    return authenticatedPost("/report/unresponsive", data);
  });

export const getMyReportedUserIds = async (): Promise<string[]> => {
  let res: { targetUserIds?: string[] };
  try {
    res = await authenticatedGet<{ targetUserIds?: string[] }>("/reports/mine");
  } catch (error: any) {
    if (error?.status !== 404 && error?.response?.status !== 404) throw error;
    res = await authenticatedGet<{ targetUserIds?: string[] }>("/report/mine");
  }
  return res?.targetUserIds ?? [];
};
