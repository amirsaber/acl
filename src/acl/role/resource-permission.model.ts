import { Permission } from '../permission';
import { Resource } from '../resource';

export class ResourcePermissionModel {
    public static Merge(first: ResourcePermissionModel[], second: ResourcePermissionModel[]) {
        const result: ResourcePermissionModel[] = [];
        for (const resourcePermission of first) {
            result.push(resourcePermission);
        }
        for (const resourcePermission of second) {
            const index = result.findIndex((resourcePermissions) => {
                return resourcePermissions.resource.Id === resourcePermission.resource.Id;
            });
            if (index === -1) {
                result.push(resourcePermission);
            } else {
                result[index].addPermissions(resourcePermission.Permissions);
            }
        }
        return result;
    }

    public static Subtract(first: ResourcePermissionModel[], second: ResourcePermissionModel[]) {
        const result: ResourcePermissionModel[] = [];
        for (const resourcePermissions of first) {
            result.push(resourcePermissions);
        }
        for (const resourcePermissions of second) {
            const index = result.findIndex((resourcePermissions) => {
                return resourcePermissions.resource.Id === resourcePermissions.resource.Id;
            });
            if (index !== -1) {
                result[index].removePermissions(resourcePermissions.Permissions);
            }
        }
        return result;
    }

    private resource: Resource;
    private permissions: Permission[];

    constructor(resource: Resource, permissions?: Permission[]) {
        this.resource = resource;
        if (permissions) {
            this.permissions = permissions;
        } else {
            permissions = [];
        }
    }

    public get Resource() {
        return this.resource;
    }

    public get Permissions() {
        return this.permissions;
    }

    public removePermission(permission: Permission) {
        const index = this.findPermissionIndex(permission);
        if (index > -1) {
            this.permissions.splice(index, 1);
        }
    }

    public removePermissions(permissions: Permission[]) {
        for (const permission of permissions) {
            this.removePermission(permission);
        }
    }

    public addPermission(permission: Permission) {
        const index = this.findPermissionIndex(permission);
        if (index === -1) {
            this.permissions.push(permission);
        }
    }

    public addPermissions(permissions: Permission[]) {
        for (const permission of permissions) {
            this.addPermission(permission);
        }
    }

    private findPermissionIndex(permission: Permission) {
        return this.permissions.findIndex((permissionI) => {
            return permission.Id === permissionI.Id;
        });
    }
}