import { executeAnsibleTestPlaybook } from './ansibleTestPlaybook.js';
import { executeGetOSDetailsLinux } from './getOSDetailsLinux.js';
import { executeRestartAzureAgentLinux } from './restartAzureAgentLinux.js';
import { executeHelloWorldScript } from './helloWorldScript.js';
import { executegetosdetailsPlaybook } from './getosdetails.js';

let isCancelled = false;

function cancelOperation(addMessage) {
    isCancelled = true;
    addMessage("Operation will be cancelled.", 'bot');
}

export { cancelOperation };