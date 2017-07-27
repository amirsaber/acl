import { ResourceModel } from './resource.model';

export class ResourceStorage {
    public static resources: ResourceModel[] = [];
    public static resourceId = 0;

    public static createResource(role: ResourceModel) {
        role.Id = ResourceStorage.resourceId;
        ResourceStorage.resources.push(role);
        ResourceStorage.resourceId++;
    }

    public static getResource(roleId: number) {
        const index = ResourceStorage.getResourceIndex(roleId);
        if (index > -1) {
            return ResourceStorage.resources[index];
        } else {
            throw {
                err: 'Get Resource',
                message: 'Resource does not exist'
            };
        }
    }

    public static getResourceIndex(roleId: number) {
        return ResourceStorage.resources.findIndex((role) => {
            if (role.Id === roleId) {
                return true;
            }
        });
    }

    public static deleteResource(role: ResourceModel) {
        const index = ResourceStorage.getResourceIndex(role.Id);
        if (index > -1) {
            ResourceStorage.resources.splice(index, 1);
        } else {
            throw {
                err: 'Delete Resource',
                message: 'Resource does not exist'
            };
        }
    }

    public static update(resource: ResourceModel) {
        const index = ResourceStorage.getResourceIndex(resource.Id);
        if (index > -1) {
            ResourceStorage.resources[index] = resource;
        } else {
            throw {
                err: 'Update Resource',
                message: 'Resource does not exist'
            };
        }
    }
}