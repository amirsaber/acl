import { Permission } from '../permission';

import { ResourceStorage } from './resource.storage';

export class ResourceModel {
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
            ResourceStorage.getResource(this.Id);
            return true;
        } catch (err) {
            return false;
        }
    }

    public delete() {
        try {
            ResourceStorage.deleteResource(this);
        } catch (err) {
            throw {
                err: 'Delete',
                sub_err: err.err,
                message: 'Can not delete Resource',
                sub_message: err.message
            };
        }
    }

    private create() {
        ResourceStorage.createResource(this);
    }

    private update() {
        ResourceStorage.update(this);
    }
}