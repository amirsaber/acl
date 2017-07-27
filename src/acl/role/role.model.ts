import { Resource } from '../resource';
import { Permission } from '../permission';

import { RoleStorage } from './role.storage';
import { ResourcePermissionModel } from './resource-permission.model';

export class RoleModel {
    private id: number;
    private name: string;
    private parents: RoleModel[] = [];
    private allows: ResourcePermissionModel[] = [];
    private exceptions: ResourcePermissionModel[] = [];

    constructor(name: string) {
        this.name = name;
        this.create();
    }

    public set Id(id: number) {
        this.id = id;
    }

    public get Id() {
        return this.id;
    }

    public get Name() {
        return this.name;
    }

    public get Allowed() {
        let result = this.calculateAllows();
        result = ResourcePermissionModel.Subtract(result, this.exceptions);
        return result;
    }

    public checkExistance() {
        try {
            RoleStorage.getRole(this.Id);
            return true;
        } catch (err) {
            return false;
        }
    }

    public delete() {
        if (this.checkExistance()) {
            RoleStorage.deleteRole(this);
        } else {
            throw {
                err: 'Delete',
                message: 'Role does not exist',
            };
        }
    }

    public addParent(parentRole: RoleModel) {
        if (parentRole.checkExistance()) {
            if (!this.isParentExist(parentRole)) {
                this.parents.push(parentRole);
                this.update();
            } else {
                throw {
                    err: 'Add Parent',
                    message: 'Parent already exist'
                };
            }
        } else {
            throw {
                err: 'Add Parent',
                message: 'Parent role does not exist',
            };
        }
    }

    public allow(resource: Resource, permission: Permission) {
        if (resource.checkExistance() && permission.checkExistance()) {
            if (this.isResourceExist(resource)) {
                const resourceIndex = this.findResourceIndex(resource);
                (resourceIndex);
                if (!this.isResourcePermissionExist(this.allows[resourceIndex], permission)) {
                    this.allows[resourceIndex].Permissions.push(permission);
                    this.update();
                } else {
                    throw {
                        err: 'Add ResourcePermission',
                        message: 'Permission already exists for this Resource'
                    }
                }
            } else {
                this.allows.push(new ResourcePermissionModel(resource, [permission]));
                this.update();
            }
        } else {
            throw {
                err: 'Add ResourcePermission',
                message: 'ResourcePermission does not exist',
            };
        }
    }

    public except(resource: Resource, permission: Permission) {
        if (resource.checkExistance() && permission.checkExistance()) {
            if (this.isResourceExistExcept(resource)) {
                const resourceIndex = this.findResourceIndexExcept(resource);
                (resourceIndex);
                if (!this.isResourcePermissionExistExcept(this.allows[resourceIndex], permission)) {
                    this.exceptions[resourceIndex].Permissions.push(permission);
                    this.update();
                } else {
                    throw {
                        err: 'Add ResourcePermission',
                        message: 'Permission already exists for this Resource'
                    }
                }
            } else {
                this.exceptions.push(new ResourcePermissionModel(resource, [permission]));
                this.update();
            }
        } else {
            throw {
                err: 'Add ResourcePermission',
                message: 'ResourcePermission does not exist',
            };
        }
    }

    private isParentExist(parentRole: RoleModel) {
        const index = this.findParentIndex(parentRole);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    private isResourceExist(resource: Resource) {
        const index = this.findResourceIndex(resource);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    private isResourceExistExcept(resource: Resource) {
        const index = this.findResourceIndexExcept(resource);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    private isResourcePermissionExist(resourcePermission: ResourcePermissionModel, permission: Permission) {
        const index = this.findPermissionIndex(resourcePermission, permission);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    private isResourcePermissionExistExcept(resourcePermission: ResourcePermissionModel, permission: Permission) {
        const index = this.findPermissionIndexExcept(resourcePermission, permission);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    }

    private findParentIndex(parentRole: RoleModel) {
        return this.parents.findIndex((role) => {
            return role.Id === parentRole.Id;
        });
    }

    private findResourceIndex(resource: Resource) {
        return this.allows.findIndex((resourceI) => {
            return resourceI.Resource.Id === resource.Id;
        });
    }

    private findResourceIndexExcept(resource: Resource) {
        return this.exceptions.findIndex((resourceI) => {
            return resourceI.Resource.Id === resource.Id;
        });
    }

    private findPermissionIndex(resourcePermission: ResourcePermissionModel, permission: Permission) {
        return resourcePermission.Permissions.findIndex((permissionI) => {
            return permissionI.Id === permission.Id;
        });
    }

    private findPermissionIndexExcept(resourcePermission: ResourcePermissionModel, permission: Permission) {
        return resourcePermission.Permissions.findIndex((permissionI) => {
            return permissionI.Id === permission.Id;
        });
    }

    private create() {
        RoleStorage.createRole(this);
    }

    private update() {
        RoleStorage.update(this);
    }

    private calculateAllows() {
        let resourcePermissions: ResourcePermissionModel[] = [];
        for (const parent of this.parents) {
            const parentResourcesPermissions = parent.Allowed;
            for (const parentResourcePermission of parentResourcesPermissions) {
                resourcePermissions = ResourcePermissionModel.Merge(resourcePermissions, parentResourcesPermissions)
            }
        }
        resourcePermissions = ResourcePermissionModel.Merge(resourcePermissions, this.allows);
        return resourcePermissions;
    }
}