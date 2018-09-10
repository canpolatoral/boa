
export class GenericTreeNode<T> {
  constructor(parent: T) {
    this.parent = parent;
    this.children = [];
  }

  id: number;
  name: String;
  isExpanded: boolean;
  isSelected: boolean;
  parent: T;
  children: T[];
}

export interface ContractBase {
  isSelectable?: boolean;
  isSelected?: boolean;
}

export interface ResourceNode extends GenericTreeNode<ResourceNode> {
  assemblyName?: string;
  businessOwnerWorkgroupName?: string;
  channelId?: number;
  className?: string;
  description?: string;
  fullPath?: string;
  helpURL?: string;
  iconPath?: string;
  id?: number;
  isActive?: boolean;
  isHidden?: boolean;
  isLeaf?: boolean;
  isNew?: boolean;
  isPersonalResource?: boolean;
  isRevokable?: boolean;
  isWorkflow?: boolean;
  lastAccessTime?: Date;
  moduleCode?: string;
  name?: string;
  resourceActionList?: ResourceActionContract[];
  resourceCode?: string; 
  searchTag?: string;
  sortId?: number;
  systemDate?: Date;
  toolTipImagePath?: string;
  typeId?: number;
  uIType?: number;
  updateSystemDate?: Date;
  updateUserName?: string;
  userName?: string; 
}

interface ResourceActionContract extends ContractBase {
  actionId?: number;
  actionType?: number;
  commandName?: string;
  description?: string;
  groupName?: string;
  hasAccounting?: boolean;
  hasAuthorization?: boolean;
  hasCommission?: boolean;
  hasFutureDated?: boolean;
  hasRevokableTransaction?: boolean;
  hasSlip?: boolean;
  hasTellerTransaction?: boolean;
  hasWorkflow?: boolean;
  hostIP?: string;
  hostName?: string;
  iconPath?: string;
  isAssignable?: boolean;
  isVirtual?: boolean;
  name?: string;
  resourceId?: number;
  sortId?: number;
  systemDate?: Date;
  updateHostName?: string;
  updateSystemDate?: Date;
  updateUserName?: string;
  userName?: string;
}