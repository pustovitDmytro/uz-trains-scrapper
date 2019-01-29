const LINK = "https://booking.uz.gov.ua/uk?from=2200001&to=2204580&date=2019-01-08&url=train-list";
const jquery = "https://code.jquery.com/jquery-3.3.1.min.js"
const phantom = require('phantom');

(async function() {
    const instance = await phantom.create();
    const page = await instance.createPage();
    const waitFor = waitOnPage.bind(page);
    page.property('viewportSize',{
        width: 1440,
        height: 1088
    });
    await page.includeJs(jquery);
    await page.on('onResourceRequested', function(requestData) {
      console.info('Requesting', requestData.url);
    });
   
    await page.open(LINK);
    await waitFor('.train-table');
    const trains = await page.evaluate(function(){
        const rows = $('.train-table').find($('tr'));
            
        return Array.from(rows)
        .filter(function(row){return row.className!=='no-place'})
        .map(function(row){return{
            number: $(row).find($('td.num div')).text(),
            stationFrom: $($(row).find($('td.station div.name'))[0]).text(),
            stationTo: $($(row).find($('td.station div.name'))[1]).text(),
            departure:$($(row).find($('td.time div'))[0]).text(),
            arrival:$($(row).find($('td.time div'))[1]).text(),
            duration:$($(row).find($('td.duration'))[0]).text(),
            seets:Array.from($(row).find($('td.place div'))).map(function(elem){return{
                class: $(elem).find($("span.wagon-class span")).text(),
                amount:$(elem).find($(".place-count")).text()
            }})
        }})
    })
    console.log('trains: ');
    console.log(JSON.stringify(trains));
    await page.render('1.png');
    await instance.exit();
  })();
   