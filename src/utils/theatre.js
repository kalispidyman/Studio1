import { getProject } from '@theatre/core';

const project = getProject('Ethereal Studio');
const mainSheet = project.sheet('Main Scene');

export { project, mainSheet };
