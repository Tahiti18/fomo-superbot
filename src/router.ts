
import fs from 'fs'; import path from 'path';
type Route={ pattern:string; handler:string; route?:string; args?:Record<string,string> };
const routerPath = path.join(process.cwd(),'config','callbacks_router.json');
export function loadCallbackRouter(){ return JSON.parse(fs.readFileSync(routerPath,'utf-8')); }
export function matchPattern(p:string, d:string){ return p.endsWith('=') ? d.startsWith(p) : d===p; }
