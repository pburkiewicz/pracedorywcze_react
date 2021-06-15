const adrStr = (adr) =>
{
    console.log(adr);
    let mainName = ""
    if (adr['city']!==undefined) mainName =adr['city']
    else if (adr['town']!==undefined) mainName =adr['town']
    else if (adr['village']!==undefined) mainName =adr['village']
    else if (adr['administrative']!==undefined) mainName =adr['administrative']
    mainName += " ";
    return mainName
        +(adr['county']!==undefined ? adr['county'] + ' ' : "")
        + (adr['road']!==undefined ? adr['road'] + ' ' : "")
        + (adr['house_number']!==undefined ? adr['house_number'] + ' ': "") + (adr['postcode']!==undefined ? adr['postcode'] + " " : "");
}

export default adrStr;