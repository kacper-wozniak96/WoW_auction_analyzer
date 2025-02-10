
import { getAccessToken } from './getAccessToken.js';
import { getAuctionData } from './getAuctionData.js';
import { getConnectedRealmData } from './getConnectedRealmData.js';
import { getRealmName } from './getRealmName.js';

import { getNumbersFromString } from './utils.js';

const MULTIPLER = 10000;
const petsCagedID = 82800;

const items = [
    {
        name: "Snowclaw Cub",
        id: 201838,
        maxGoldPrice: 31000 * MULTIPLER,
        pet_specie_id: 3359,   
    },
    {
        name: "Sun Darter Hatchling",
        id: 142223,
        maxGoldPrice: 80000 * MULTIPLER,
        pet_specie_id: 382,    
    },
    {
      name: "Taptaf",
      id: 142223,
      maxGoldPrice: 16000 * MULTIPLER,
      pet_specie_id: 2198,    
    },
    {
      name: "Wicker Pup",
      id: 142223,
      maxGoldPrice: 16000 * MULTIPLER,
      pet_specie_id: 2411,    
    },
]

export const analyzeAuctionDataToBuyFrom = async (accessToken, realmId) => {
    const auctionData = await getAuctionData(accessToken, realmId);


    if(!auctionData?.auctions?.length) return;



  
    const searchedSpecies = items.map(item => item.pet_specie_id);

    const pets = auctionData.auctions.filter(auction => auction.item?.id === petsCagedID );



    const searchedPets = pets
    .filter(pet => searchedSpecies.includes(pet.item?.pet_species_id))
    .filter(pet => pet.item.pet_level === 25 )
    .filter(pet => pet.item.pet_quality_id === 3)
    .filter(pet => pet.buyout <= items.find(item => item.pet_specie_id === pet.item.pet_species_id).maxGoldPrice);


    if (!searchedPets.length) return;

    const realmName = await getRealmName(accessToken, realmId);

    if (!realmName) return;



    const petNames = searchedPets.map(pet => pet.item.pet_species_id).map(id => items.find(item => item.pet_specie_id === id).name).join(', ');

    return `${realmName} TO BUY: ${petNames}`;

};

export const analyzeServerToSellItemsTo = async (accessToken, realmId) => {
  const auctionData = await getAuctionData(accessToken, realmId);

  if(!auctionData?.auctions?.length) return;


  const pets = auctionData.auctions.filter(auction => auction.item?.id === petsCagedID );



  const sunDarters = pets
  .filter(pet => pet.item?.pet_species_id === 382)
  .filter(pet => pet.item.pet_level === 25 )
  .filter(pet => pet.item.pet_quality_id === 3)
  .map(pet => pet.buyout);

  const minBuyout = Math.min(...sunDarters);  

  const isWorthSelling = minBuyout >= 159000 * MULTIPLER;
  



  const realmName = await getRealmName(accessToken, realmId);

  if (!realmName) return;

  if (!sunDarters.length) {
    return `${realmName} - no auctions`;
  };

  if (isWorthSelling) {
    return `${realmName} - ${minBuyout/MULTIPLER}`;
  }

};





const main = async () => {
  try {
    const accessToken = await getAccessToken();
    const connectedRealms = await getConnectedRealmData(accessToken);
    const connectedRealmIds = connectedRealms.map(realm => getNumbersFromString(realm.href))
   
  
    const realmNamesToBuyItemsFrom = await Promise.all(
      connectedRealmIds.map(realmId => analyzeAuctionDataToBuyFrom(accessToken, realmId))
    );

    const realmNamesToSellDartersTo = await Promise.all(
      connectedRealmIds.map(realmId => analyzeServerToSellItemsTo(accessToken, realmId))
    );
  
    const fileredServerNamesToBuyFrom = realmNamesToBuyItemsFrom.filter(name => !!name);
    const fileredServerNamesToSellTo = realmNamesToSellDartersTo.filter(name => !!name);
  
    
    console.log(new Date())
    console.log('Buy from these servers:');
    console.log(fileredServerNamesToBuyFrom);
    console.log('---------------------');
    console.log('Sell to these servers:');
    console.log(fileredServerNamesToSellTo);
  
  
  } catch (error) {
    console.error(error);
  }

}

main();

setInterval(() => {
  main();
}, 1000 * 60 * 10);