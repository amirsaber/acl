import { Role, Resource, Permission } from './acl';

const role1 = new Role('role1');
const role2 = new Role('role2');
const role3 = new Role('role3');

const permission1 = new Permission('permission1');
const permission2 = new Permission('permission2');
const permission3 = new Permission('permission3');

const resource1 = new Resource('resource1');
const resource2 = new Resource('resource2');
const resource3 = new Resource('resource3');

role1.allow(resource1, permission1);
role1.allow(resource1, permission2);
role2.allow(resource1, permission2);
role2.allow(resource2, permission3);
role2.addParent(role1);

// console.log(role2.ResourcesPermissions);
console.log(role2.Allowed[0].Resource);
console.log(role2.Allowed[0].Permissions);
console.log(role2.Allowed[1].Resource);
console.log(role2.Allowed[1].Permissions);
