export interface ContractBase {
  isSelectable?: boolean;
  isSelected?: boolean;
}

export interface PostmanRelationContract extends ContractBase {
  postmanId?: number;
  relatedPostmanId?: number;
}

export interface ScheduleReportContract extends ContractBase {
  beginDate?: Date;
  componentId?: number;
  createDate?: Date;
  dateList?: Date[];
  emailBody?: string;
  emailSubject?: string;
  endDate?: Date;
  excelGroupCode?: string;
  flatListReport?: any;
  isEnable?: number;
  isEnableStr?: string;
  isScheduled?: number;
  isSystem?: boolean;
  lastProcessDate?: Date;
  ownerUsername?: string;
  postmanExecutionId?: number;
  postmanId?: number;
  processDateTime?: Date;
  relatedPostmanList?: PostmanRelationContract[];
  reportDescription?: string;
  reportId?: number;
  reportITOwner?: number;
  reportName?: string;
  reportRequest?: number[];
  scheduleParameter1?: number;
  scheduleParameter2?: number;
  scheduleParameter3?: number;
  scheduleParameter4?: string;
  schedulePeriodType?: number;
  scheduleType?: number;
  scheduleTypeStr?: string;
  sendDate?: Date;
  sendUserAccessPoint?: string;
  sendUserAccessPointCC?: string;
  sendUserNameList?: string;
  startTime?: string;
  status?: number;
  tranDate?: Date;
  userAccessPoint?: number;
  value?: string; 
}

export interface TimeScheduleContract extends ContractBase {
  beginDate?: Date;
  endDate?: Date;
  parameter1?: number;
  parameter2?: number;
  parameter3?: number;
  parameter4?: string;
  period?: number;
  periodDetail?: number;
}