import axios from 'axios';

export async function getConnectedRealmData(accessToken) {
    const response = await axios.get('https://eu.api.blizzard.com/data/wow/connected-realm/index', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        namespace: 'dynamic-eu',
        locale: 'en_GB',
      },
    });
    return response.data.connected_realms;
  }
  
  