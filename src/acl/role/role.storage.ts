import { RoleModel } from './role.model';

export class RoleStorage {
    public static roles: RoleModel[] = [];
    public static roleId = 0;

    public static createRole(role: RoleModel) {
        role.Id = RoleStorage.roleId;
        RoleStorage.roles.push(role);
        RoleStorage.roleId++;
    }

    public static getRole(roleId: number) {
        const index = RoleStorage.getRoleIndex(roleId);
        if (index > -1) {
            return RoleStorage.roles[index];
        } else {
            throw {
                err: 'Get Role',
                message: 'Role does not exist'
            };
        }
    }

    public static getRoleIndex(roleId: number) {
        return RoleStorage.roles.findIndex((role) => {
            if (role.Id === roleId) {
                return true;
            }
        });
    }

    public static deleteRole(role: RoleModel) {
        const index = RoleStorage.getRoleIndex(role.Id);
        if (index > -1) {
            RoleStorage.roles.splice(index, 1);
        } else {
            throw {
                err: 'Delete Role',
                message: 'Role does not exist'
            };
        }
    }

    public static update(role: RoleModel) {
        const index = RoleStorage.getRoleIndex(role.Id);
        if (index > -1) {
            RoleStorage.roles[index] = role;
        } else {
            throw {
                err: 'Update Role',
                message: 'Role does not exist'
            };
        }
    }
}