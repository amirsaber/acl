import { PermissionModel } from './permission.model';

export class PermissionStorage {
    public static permissions: PermissionModel[] = [];
    public static permissionId = 0;

    public static createPermission(role: PermissionModel) {
        role.Id = PermissionStorage.permissionId;
        PermissionStorage.permissions.push(role);
        PermissionStorage.permissionId++;
    }

    public static getPermission(roleId: number) {
        const index = PermissionStorage.getPermissionIndex(roleId);
        if (index > -1) {
            return PermissionStorage.permissions[index];
        } else {
            throw {
                err: 'Get Permission',
                message: 'Permission does not exist'
            };
        }
    }

    public static getPermissionIndex(roleId: number) {
        return PermissionStorage.permissions.findIndex((role) => {
            return role.Id === roleId;
        });
    }

    public static deletePermission(role: PermissionModel) {
        const index = PermissionStorage.getPermissionIndex(role.Id);
        if (index > -1) {
            PermissionStorage.permissions.splice(index, 1);
        } else {
            throw {
                err: 'Delete Permission',
                message: 'Permission does not exist'
            };
        }
    }
}