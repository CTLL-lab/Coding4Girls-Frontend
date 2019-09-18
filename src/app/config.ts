import { environment } from 'src/environments/environment';

// export const apiURL = 'http://localhost:5000';
export const apiURL = environment.apiURL;
// export const apiURL = 'https://api.coding4girls.e-ce.uth.gr';
export const imgurAPI = 'https://api.imgur.com/3';
export const priviledged_roles = ['admin', 'teacher', 'sysadmin'];
export const fully_priviledged_roles = ['admin', 'sysadmin'];
export const languages_available = [
  {
    name: 'English',
    imagePath: 'assets/FlagIcons/flag_united_kingdom.png',
    code: 'en'
  },
  {
    name: 'Greek',
    imagePath: 'assets/FlagIcons/flag_greece.png',
    code: 'el'
  },
  {
    name: 'Turkish',
    imagePath: 'assets/FlagIcons/flag_turkey.png',
    code: 'tr'
  },
  {
    name: 'Bulgarian',
    imagePath: 'assets/FlagIcons/flag_bulgaria.png',
    code: 'bg'
  },
  {
    name: 'Croatian',
    imagePath: 'assets/FlagIcons/flag_croatia.png',
    code: 'hr'
  },
  {
    name: 'Slovenian',
    imagePath: 'assets/FlagIcons/flag_slovenia.png',
    code: 'sl'
  },
  {
    name: 'Portugese',
    imagePath: 'assets/FlagIcons/flag_portugal.png',
    code: 'pt'
  }
];
