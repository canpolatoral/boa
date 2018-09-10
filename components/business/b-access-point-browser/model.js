
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

export interface ContractBase {
  isSelectable?: boolean;
  isSelected?: boolean;
}
 
export interface AuthorizationAccessPointNode extends GenericTreeNode<AuthorizationAccessPointNode> {
  id: number;
  accessPointId?: number;
  name?: string;
  parentId?: number;
  workgroupId?: number;
  isCheckBoxEnabled?: boolean;
  isExpandedBefore?: boolean;

  role?: AuthorizationRoleContract;
  user?: AuthorizationUserContract;
  workgroup?: AuthorizationWorkgroupContract;
}

export interface AuthorizationRoleContract extends ContractBase {
  accessPointId?: number;
  isChecked?: boolean;
  roleId?: number;
  roleName?: string;
  workgroupId?: number;
  workGroupName?: string;
}

export interface AuthorizationUserContract extends ContractBase {
  accessPointId?: number;
  isChecked?: boolean;
  name?: string;
  roleId?: number;
  roleName?: string;
  userCode?: string;
  userId?: number;
  workgroupId?: number;
  workGroupName?: string;
}

export interface AuthorizationWorkgroupContract extends ContractBase {
  accessPointId?: number;
  name?: string;
  parentId?: number;
  workgroupId?: number;
}