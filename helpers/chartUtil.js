const getMonths = () => {
    const today = new Date();
    const todayMonth = today.getMonth() - 1;
    const todayYear = today.getFullYear();
    const firstOfEachMonth = [];

    for (let i=0; i<=11; i++) {
        var firstOfMonth = new Date(todayYear, todayMonth - i, 1);
        firstOfEachMonth.push({
            DateString: firstOfEachMonth.toLocaleString("default", {
                month: "long",
                day: "numeric",
                year: "numberic"
            }),
            DateUnixTime: firstOfMonth.getTime(),
            Date: firstOfMonth,
        });
    }

    return firstOfEachMonth.reverse();
}

const filterDealsAmount = (month, deals) => {
    let filteredDeals = [];

    for (let deal in deals) {
        const dealId = deals[deal].dealid;
        let currentDeal = deals[deal];

        if (currentDeal.deal.properties['amount']) {
            for (let version in currentDeal.deal.properties["amount"].versions) {
                let currentVersion = currentDeal.deal.properties['amount'].versions[version];

                if (currentVersion && currentVersion.timestamp < month) {
                    if ( filteredDeals.find(x => x.dealId === dealId) === undefined ) {
                        filteredDeals.push({
                            dealId: dealId,
                            stageDate: new Date(currentVersion.stageTime).toLocaleDateString(),
                            stage: currentVersion.stage,
                            amount: 
                                currentDeal.deal.properties['amount'] && 
                                currentDeal.deal.properties['amount'].value !== '' 
                                    ? currentVersion && currentVersion.value !== '' 
                                        ? parseFloat(currentVersion.value)
                                        : parseFloat(currentDeal.deal.properties["amount"].value)
                                    : 0
                        })
                    }
                }
            }
        }
    }
    return filteredDeals;
}

const filterDealsStage = (month, deals, stageMap) => {
    var finalFilter = [];
    var excludedDeals = [];
    for (var deal in deals) {
      var dealId = deals[deal].dealId;
      var currentDeal = deals[deal];
      //for each version loop through and find the most recent one for the given time period.
      for (var version in currentDeal.properties["dealstage"].versions) {
        var currentVersion =
          currentDeal.properties["dealstage"].versions[version];
        if (currentVersion && currentVersion.timestamp < month) {
          if (
            stageMap.get(currentVersion.value) !== "1.0" &&
            stageMap.get(currentVersion.value) !== "0.0"
          ) {
            //if we have not added the version and we have not excluded the deal (see below), add the deal.
            if (
              finalFilter.find((x) => x.dealid === dealId) === undefined &&
              excludedDeals.find((x) => x.dealid === dealId) === undefined
            )
              finalFilter.push({
                dealid: dealId,
                deal: currentDeal,
                stage: stageMap.get(currentVersion.value),
                stageTime: currentVersion.timestamp,
              });
          }
          //if the most recent version of the deal is at 0 or 1, then we need to make sure we do not add another version. This was causing issue when totaling
          else {
            excludedDeals.push({ dealid: dealId });
          }
        }
      }
    }
    return finalFilter;
}

module.exports = {
    getMonths,
    filterDealsAmount,
    filterDealsStage,
}