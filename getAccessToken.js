import axios from 'axios';

const clientId = '4d26a80f2ec04cd99615441983616df2';
const clientSecret = '04zqV58G94khMaNlELqmKuoDN9MpZJsW';

export async function getAccessToken() {
    const response = await axios.post('https://eu.battle.net/oauth/token', null, {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      params: {
        grant_type: 'client_credentials',
      },
    });
    return response.data.access_token;
  }