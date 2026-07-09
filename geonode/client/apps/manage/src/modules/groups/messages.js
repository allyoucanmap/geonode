import { gettext } from '@geonode/i18n'

export const groups = {
  title: gettext('Groups'),
  group: gettext('Group'),
  newGroup: gettext('New group'),

  name: gettext('Name'),
  slug: gettext('Slug'),
  description: gettext('Description'),
  email: gettext('Email'),
  access: gettext('Access'),
  keywords: gettext('Keywords'),
  categories: gettext('Categories'),

  searchGroups: gettext('Search groups'),
  view: gettext('View'),

  overview: gettext('Overview'),
  members: gettext('Members'),
  managers: gettext('Managers'),
  resources: gettext('Resources'),

  accessPublic: gettext('Public'),
  accessPublicInvite: gettext('Public (invite-only)'),
  accessPrivate: gettext('Private'),

  edit: gettext('Edit'),
  save: gettext('Save'),
  cancel: gettext('Cancel'),
  couldNotSave: gettext('Could not save'),

  createGroup: gettext('Create group'),
  couldNotCreate: gettext('Could not create group'),

  deleteGroup: gettext('Delete group'),
  deleteGroupConfirm: gettext('This permanently deletes the group. Membership and group ownership of resources are affected.'),
  delete: gettext('Delete'),
  loadingGroup: gettext('Loading group'),

  username: gettext('Username'),
  memberEmail: gettext('Email'),
  noMembers: gettext('No members'),
  noMembersDesc: gettext('This group has no members.'),
  noManagers: gettext('No managers'),
  noManagersDesc: gettext('This group has no managers.'),
  resourceTitle: gettext('Title'),
  resourceType: gettext('Type'),
  noResources: gettext('No resources'),
  noResourcesDesc: gettext('This group owns no visible resources.'),
}
