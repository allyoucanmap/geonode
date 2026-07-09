import { gettext } from '@geonode/i18n'

export const home = {
  title: gettext('Home'),

  welcomeBack: gettext('Welcome back'),
  accountOverview: gettext('Overview of your GeoNode account.'),

  yourAccount: gettext('Your account'),
  name: gettext('Name'),
  username: gettext('Username'),
  email: gettext('Email'),
  role: gettext('Role'),
  superuser: gettext('Superuser'),
  member: gettext('Member'),
  groups: gettext('Groups'),
  notProvided: gettext('Not provided'),
  noGroups: gettext('You are not a member of any group.'),

  loading: gettext('Loading your profile'),
  couldNotLoad: gettext('Could not load your profile'),

  browseTitle: gettext('Browse my resources'),
  loadingFacets: gettext('Loading facets'),
  facetsError: gettext('Could not load facets'),
  treeEmpty: gettext('Nothing here'),
}
