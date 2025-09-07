import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
  ownerAc,
  memberAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "share", "delete"],
} as const;

const ac = createAccessControl(statement);

// DEfault roles
const owner = ac.newRole({
  project: ["create", "update"],
  ...ownerAc.statements,
});
const admin = ac.newRole({
  project: ["create", "update"],
  ...adminAc.statements,
});
const member = ac.newRole({
  project: ["create", "update"],
  ...memberAc.statements,
});
// Custom Roles
const manager = ac.newRole({
  project: ["create", "update"],
  member: ["create", "update"],
  invitation: ["create"],
});
const analyst = ac.newRole({
  project: ["share"],
});
const contributor = ac.newRole({
  project: ["create", "update"],
});
const employee = ac.newRole({ project: ["share"] });
const intern = ac.newRole({ project: ["share"] });

export {
  ac,
  owner,
  admin,
  member,
  manager,
  analyst,
  contributor,
  employee,
  intern,
};
