import { environment } from 'src/environments/environment';

export const apiURL = environment.apiURL;
export const imgurAPI = environment.imgurAPI;

export const priviledged_roles = ['admin', 'teacher', 'sysadmin'];
export const fully_priviledged_roles = ['admin', 'sysadmin'];
export const languages_available = [
  {
    name: 'English',
    imagePath: 'assets/FlagIcons/flag_united_kingdom.png',
    code: 'en',
  },
  {
    name: 'Greek',
    imagePath: 'assets/FlagIcons/flag_greece.png',
    code: 'el',
  },
  {
    name: 'Turkish',
    imagePath: 'assets/FlagIcons/flag_turkey.png',
    code: 'tr',
  },
  {
    name: 'Bulgarian',
    imagePath: 'assets/FlagIcons/flag_bulgaria.png',
    code: 'bg',
  },
  {
    name: 'Croatian',
    imagePath: 'assets/FlagIcons/flag_croatia.png',
    code: 'hr',
  },
  {
    name: 'Italian',
    imagePath: 'assets/FlagIcons/flag_italy.png',
    code: 'it',
  },
  {
    name: 'Slovenian',
    imagePath: 'assets/FlagIcons/flag_slovenia.png',
    code: 'sl',
  },
  {
    name: 'Portugese',
    imagePath: 'assets/FlagIcons/flag_portugal.png',
    code: 'pt',
  },
];
