import { PermissionStorage } from './permission.storage';

export class PermissionModel {
    private id: number;
    private name: string;

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

    public checkExistance() {
        try {
            PermissionStorage.getPermission(this.Id);
            return true;
        } catch (err) {
            return false;
        }
    }

    public delete() {
        if (this.checkExistance()) {
            PermissionStorage.deletePermission(this);
        } else {
            throw {
                err: 'Delete',
                message: 'Permission does not exist',
            };
        }
    }

    private create() {
        PermissionStorage.createPermission(this);
    }
}