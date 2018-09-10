
export class GenericTreeNode<T> {
  constructor(parent: T, identity: Number) {
    this.parent = parent;
    this.identity = identity;
    this.children = [];
  }

  id: number;
  name: String;
  identity: number;
  isExpanded: boolean;
  isSelected: boolean;
  parent: T;
  children: T[];
}

export class TransactionNode extends GenericTreeNode<TransactionNode> {
  transactionDefinition: TransactionDefinitionContract;
  transactionDetailDefinition: TransactionDetailDefinitionContract;
  transactionGroupDefinition: TransactionGroupDefinitionContract;
}

export interface ContractBase {
  isSelectable?: boolean;
  isSelected?: boolean;
}

export interface TransactionDefinitionContract extends ContractBase {
  accountNeed?: number;
  activeFrom?: Date;
  activeTo?: Date;
  amountNeed?: number;
  branchIdNeed?: number;
  cardNumberNeed?: number;
  depositWithdrawal?: number;
  fecNeed?: number;
  ferNeed?: number;
  hostIp?: string;
  hostName?: string;
  iBANNeed?: number;
  personIdNeed?: number;
  redirectedTranGroup?: string;
  suffixNeed?: number;
  systemDate?: Date;
  taxNumberNeed?: number;
  toAccountNeed?: number;
  toAmountNeed?: number;
  toBankNeed?: number;
  toBranchIdNeed?: number;
  toFECNeed?: number;
  toPersonIdNeed?: number;
  toSuffixNeed?: number;
  toTaxNumberNeed?: number;
  transactionCode?: string;
  transactionDetail?: number;
  transactionGroup?: number;
  transactionName?: string;
  transactionType?: number;
  updateHostName?: string;
  updateSystemDate?: Date;
  updateUserName?: string;
  userIdNeed?: number;
  userName?: string;
  isAuthorizedCheckActive?: number;
}

export interface TransactionDetailDefinitionContract extends ContractBase {
  name?: string;
  transactionDetailId?: number;
  transactionGroupId?: number;
}

export interface TransactionGroupDefinitionContract extends ContractBase {
  name?: string;
  transactionGroupId?: number;
}

export interface ParameterContract extends ContractBase {
  isAllOptionValue?: boolean;
  isSelectable?: boolean;
  languageId?: number;
  paramCode?: string;
  paramDate?: string;
  paramDescription?: string;
  paramGroupCode?: string;
  paramType?: string;
  paramValue?: string;
  paramValue2?: string;
  paramValue3?: string;
  paramValue4?: string;
  paramValue5?: string;
  paramValue6?: string;
  paramValue7?: string;
  paramValue8?: string;
  sortOrder?: number;
}
