import { gettext } from '@geonode/i18n'

export const users = {
  title: gettext('Users'),
  user: gettext('User'),
  newUser: gettext('New user'),

  username: gettext('Username'),
  email: gettext('Email'),
  firstName: gettext('First name'),
  lastName: gettext('Last name'),

  searchUsers: gettext('Search users'),
  view: gettext('View'),

  profile: gettext('Profile'),
  groups: gettext('Groups'),
  resources: gettext('Resources'),

  role: gettext('Role'),
  superuser: gettext('Superuser'),
  staff: gettext('Staff'),
  edit: gettext('Edit'),
  save: gettext('Save'),
  cancel: gettext('Cancel'),
  password: gettext('Password'),
  newPassword: gettext('New password'),
  keepPasswordHint: gettext('Leave blank to keep the current password'),
  couldNotSave: gettext('Could not save'),

  createUser: gettext('Create user'),
  couldNotCreate: gettext('Could not create user'),

  deleteUser: gettext('Delete user'),
  deleteUserConfirm: gettext('This permanently deletes the user; any resources they own are reassigned to an admin.'),
  delete: gettext('Delete'),
  loadingUser: gettext('Loading user'),

  removeManagerAll: gettext('Remove as manager from all groups'),
  removeManagerTitle: gettext('Remove as group manager'),
  removeManagerConfirm: gettext(
    'Remove this user as manager from every group they manage? Group membership is not affected.',
  ),
  remove: gettext('Remove'),
  group: gettext('Group'),
  slug: gettext('Slug'),
  noGroups: gettext('No groups'),
  noGroupsDesc: gettext('This user is not a member of any group.'),

  resourceTitle: gettext('Title'),
  resourceType: gettext('Type'),
  noResources: gettext('No resources'),
  noResourcesDesc: gettext('This user owns no visible resources.'),
}
