import { expect } from 'chai';

import { Permission, Role, Resource } from '../../acl'

describe('ACL', () => {
    it('Should have empty resources and permissions', () => {
        const role = new Role('role');

        const resourcePermission = role.Allowed;
        expect(resourcePermission.length).to.be.equal(0);
    });

    it('Should add a permision of a resource to a role', () => {
        const role = new Role('role');
        const permission = new Permission('permission');
        const resource = new Resource('resource');
        role.allow(resource, permission);

        const resourcePermission = role.Allowed;
        expect(resourcePermission.length).to.be.equal(1);
        expect(resourcePermission[0].Permissions.length).to.be.equal(1);
    });

    it('Should inherit one permission', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);

        const role2 = new Role('role2');
        role2.addParent(role1);

        const resourcePermission = role2.Allowed;
        expect(resourcePermission.length).to.be.equal(1);
        expect(resourcePermission[0].Permissions.length).to.be.equal(1);
    });

    it('Should inherit two permission', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const permission2 = new Permission('permission2');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);
        role1.allow(resource1, permission2);

        const role2 = new Role('role2');
        role2.addParent(role1);

        const resourcePermission = role2.Allowed;
        expect(resourcePermission.length).to.be.equal(1);
        expect(resourcePermission[0].Permissions.length).to.be.equal(2);
    });

    it('Should inherit two permission with one it\'s one permission', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const permission2 = new Permission('permission2');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);
        role1.allow(resource1, permission2);

        const role2 = new Role('role2');
        const permission3 = new Permission('permission3');
        role2.allow(resource1, permission3);
        role2.addParent(role1);

        const resourcePermission = role2.Allowed;
        expect(resourcePermission.length).to.be.equal(1);
        expect(resourcePermission[0].Permissions.length).to.be.equal(3);
    });

    it('Should inherit two permission with one it\'s one permission and a new resource', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const permission2 = new Permission('permission2');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);
        role1.allow(resource1, permission2);

        const role2 = new Role('role2');
        const permission3 = new Permission('permission3');
        const permission4 = new Permission('permission4');
        const resource2 = new Resource('resource2');
        role2.allow(resource1, permission3);
        role2.allow(resource2, permission4);
        role2.addParent(role1);

        const resourcePermission = role2.Allowed;
        expect(resourcePermission.length).to.be.equal(2);
        expect(resourcePermission[0].Permissions.length).to.be.equal(3);
        expect(resourcePermission[1].Permissions.length).to.be.equal(1);
    });

    it('Should inherit two resource from two parents', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);

        const role2 = new Role('role2');
        const permission2 = new Permission('permission2');
        const resource2 = new Resource('resource2');
        role2.allow(resource2, permission2);

        const role3 = new Role('Role3');
        role3.addParent(role1);
        role3.addParent(role2);

        const resourcePermission = role3.Allowed;
        expect(resourcePermission.length).to.be.equal(2);
        expect(resourcePermission[0].Permissions.length).to.be.equal(1);
        expect(resourcePermission[1].Permissions.length).to.be.equal(1);
    });

    it('Should inherit from multi level parents', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);

        const role2 = new Role('role2');
        const permission2 = new Permission('permission2');
        const resource2 = new Resource('resource2');
        role2.allow(resource2, permission2);
        role2.addParent(role1);

        const role3 = new Role('Role3');
        role3.addParent(role2);

        const resourcePermission = role3.Allowed;
        expect(resourcePermission.length).to.be.equal(2);
        expect(resourcePermission[0].Permissions.length).to.be.equal(1);
        expect(resourcePermission[1].Permissions.length).to.be.equal(1);
    });

    it('Should inherit from multi level parents with duplicate permissions', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const permission11 = new Permission('permission11');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);
        role1.allow(resource1, permission11);

        const role2 = new Role('role2');
        const permission2 = new Permission('permission2');
        const resource2 = new Resource('resource2');
        role2.allow(resource2, permission2);
        role2.allow(resource1, permission11);
        role2.addParent(role1);

        const role3 = new Role('Role3');
        role3.addParent(role2);

        const resourcePermission = role3.Allowed;
        expect(resourcePermission.length).to.be.equal(2);
        expect(resourcePermission[0].Permissions.length).to.be.equal(2);
        expect(resourcePermission[1].Permissions.length).to.be.equal(1);
    });

    it('Should not have parent permission with exception', () => {
        const role1 = new Role('role1');
        const permission1 = new Permission('permission1');
        const permission2 = new Permission('permission2');
        const resource1 = new Resource('resource1');
        role1.allow(resource1, permission1);
        role1.allow(resource1, permission2);

        const role2 = new Role('role2');
        const permission3 = new Permission('permission3');
        const permission4 = new Permission('permission4');
        const resource2 = new Resource('resource2');
        role2.allow(resource1, permission3);
        role2.allow(resource2, permission4);
        role2.addParent(role1);
        role2.except(resource1, permission1);

        const resourcePermission = role2.Allowed;
        expect(resourcePermission.length).to.be.equal(2);
        expect(resourcePermission[0].Permissions.length).to.be.equal(2);
        expect(resourcePermission[1].Permissions.length).to.be.equal(1);
    });
})