
import fs from 'fs'; import path from 'path';
const menusPath = path.join(process.cwd(),'config','menus.json');
export type MenuDef={ title:string; buttons:{text:string;cb:string}[][] };
export function loadMenus(){ return JSON.parse(fs.readFileSync(menusPath,'utf-8')); }
