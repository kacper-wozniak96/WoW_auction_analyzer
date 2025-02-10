import axios from 'axios';


export async function getAuctionData(accessToken, realmId) {
    const response = await axios.get(`https://eu.api.blizzard.com/data/wow/connected-realm/${realmId}/auctions`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        namespace: 'dynamic-eu',
        locale: 'en_GB',
      },
    });
    return response.data;
  }