const axios = require('axios');
const fs = require('fs');
const htmlEncode = require('htmlencode');
const helper = require('../helpers/helper');
const loggerService = require('../../service/loggerService');
const errorHandlerService = require('../../service/errorHandlerService');
require('dotenv').config();

const subscriptionHeader = { 'Ocp-Apim-Subscription-Key': process.env.LUIS_SUBSCRIPTION_KEY };
const url = process.env.LUIS_URL;
const defaultAppName = 'Node Chatbot Test';
let appId = '';

async function makeRequest(text) {
  let retVal = null;
  try {
    retVal = await axios.get(`${url}v2.0/apps/${appId}?subscription-key=${process.env.LUIS_SUBSCRIPTION_KEY}&timezoneOffset=${new Date().getTimezoneOffset()}&q=${text}`);
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return retVal;
}

async function getAppList() {
  let retVal = null;
  try {
    retVal = await axios.get(`${url}api/v2.0/apps`, {
      headers: subscriptionHeader,
    });
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return retVal;
}

async function deleteApp(appName) {
  try {
    const result = await getAppList();
    const findAndDelete = async () => {
      const deleteResult = await Promise.all(result.data.map(async (app) => {
        if (app.name === appName) {
          try {
            return await axios.delete(`${url}api/v2.0/apps/${app.id}`, {
              headers: subscriptionHeader,
            });
          } catch (e) { errorHandlerService.handle(e); }
        }
        return true;
      }));
      loggerService.log(`Removed app ${deleteResult}`);
    };
    await findAndDelete();
  } catch (e) {
    errorHandlerService.handle(e);
  }
}

async function trainApp() {
  loggerService.log('Training started');
  try {
    await axios.post(`${url}api/v2.0/apps/${appId}/versions/0.1/train`, null, {
      headers: subscriptionHeader,
    });
    const checkTrained = async () => {
      await helper.timeout(1000);
      loggerService.log('Check Training', appId);
      try {
        const apps = (await axios.get(`${url}api/v2.0/apps/${appId}/versions/0.1/train`, {
          headers: subscriptionHeader,
        })).data;
        let isTrained = true;
        for (let i = 0; i < apps.length; i += 1) {
          if (apps[i] && apps[i].details && apps[i].details.status !== 'Success') {
            isTrained = false;
            break;
          }
        }
        if (!isTrained) {
          await checkTrained();
        }
      } catch (e) {
        errorHandlerService.handle(e);
      }
    };
    await checkTrained();
    loggerService.log('Training finished');
  } catch (e) {
    errorHandlerService.handle(e);
  }
}

async function publishApp() {
  loggerService.log('Publish started...');
  try {
    await axios.post(`${url}api/v2.0/apps/${appId}/publish`,
      {
        versionId: '0.1',
        isStaging: false,
        region: 'westus',
      },
      {
        headers: subscriptionHeader,
      });
    loggerService.log('Published successfully!');
  } catch (e) {
    errorHandlerService.handle(e.response.data);
  }
}

async function importApp() {
  let retVal = null;
  try {
    const contents = JSON.parse(fs.readFileSync('api/nlp/cognitiveModels/reminders.json'));
    const headersObj = helper.clone(subscriptionHeader);
    headersObj['Content-Type'] = 'application/json';
    const x = await axios.post(`${url}api/v2.0/apps/import?appName=${htmlEncode.htmlEncode(defaultAppName)}`, contents,
      {
        headers: headersObj,
      });
    retVal = x.data;
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return retVal;
}

async function init() {
  try {
    await deleteApp(defaultAppName);
    appId = await importApp();
    await trainApp(appId);
    await publishApp(appId);
  } catch (e) {
    errorHandlerService.handle(e);
  }
}

async function handleMessage(payload) {
  let retVal = null;
  const messageText = payload.message.text;
  try {
    const result = await makeRequest(messageText);
    const nlpResult = JSON.parse(result);
    retVal = { intent: nlpResult.topScoringIntent.intent, entities: [] };
    nlpResult.entities.forEach((entity) => {
      retVal.entities = retVal.entities.concat(entity.resolution.values);
    });
  } catch (e) {
    errorHandlerService.handle(e);
  }
  return retVal;
}

module.exports = { handleMessage, init };
