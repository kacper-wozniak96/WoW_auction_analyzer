import axios from 'axios';

export async function getRealmName(accessToken, realmId) {

    try {
        const response = await axios.get(`https://eu.api.blizzard.com/data/wow/connected-realm/${realmId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                namespace: 'dynamic-eu',
                locale: 'en_GB',
            },
        });


        
        
        
        if(response.data.category === 'Russian') return;
        const includedRealmNames = response.data.realms.filter(realm => realm.category !== 'Russian').map(realm => realm.name).join('---');

        return includedRealmNames;
     
    } catch (error) {} 
 
 }