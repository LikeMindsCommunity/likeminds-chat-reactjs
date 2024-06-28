/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ReportTagMessage {
  id: number;
  name: string;
}

export interface GetReportTagsChatResponse {
  success: boolean;
  data?: {
    report_tags: ReportTagMessage[];
  };
  error?: any;
}
