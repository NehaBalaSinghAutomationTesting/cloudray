const fs = require('fs');
let  path = require('path');

console.log (cloudRayTask());

async function cloudRayTask() {
    let jsonBetSlipDetails = JSON.parse(fs.readFileSync(path.join(process.cwd(), "\\heartrate.json")));

    const groupedData = {};
    jsonBetSlipDetails.forEach(obj => {
        const date = obj['timestamps']['startTime'].substring(0, 10); // Extracting date part from timestamp
        if (!groupedData[date]) {
            groupedData[date] = [];
        }
        groupedData[date].push(obj);
    });
    let jsonArrayOutputData = [];
    let groupedDataValue = Object.values(groupedData);
    for (let i = 0; i< groupedDataValue.length; i++ ) {
        let min = Math.min(...groupedDataValue[i].map((beat) => beat.beatsPerMinute));
        let max = Math.max(...groupedDataValue[i].map((beat1) => beat1.beatsPerMinute));
        let sum = groupedDataValue[i].map((x) => x.beatsPerMinute);
        sum.sort((a, b) => a - b);
        let midValue = sum.length / 2;
        let median = (sum[midValue] + sum[midValue + 1]) / 2;
        let latestTime = Math.max(...groupedDataValue[i].map((beat2) => new Date(beat2.timestamps.startTime).getTime()));
        let response = {
            "min": min,
            "max": max,
            "median": median,
            "latestDataTimestamp": (new Date(latestTime)).toLocaleDateString() + (new Date(latestTime)).toLocaleTimeString()
        }
        jsonArrayOutputData.push(response);
    }
    fs.writeFileSync(path.join(process.cwd(), "\\output.json"), JSON.stringify(jsonArrayOutputData));
}
