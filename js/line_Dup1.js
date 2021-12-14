function lineDup1() {
    let data;
    let ddata; // fixme: find better way to pass data to update?

    let MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
    let WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
    let HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

    let svg = d3.select("#chart-area3").append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

    let g = svg.append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parsers/formatters
    let parseTime = d3.timeParse("%d/%m/%Y")
    let formatTime = d3.timeFormat("%d/%m/%Y")
// for tooltip
    let bisectDate = d3.bisector(d => d.date).left

// add the line for the first time
    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", "3px")

    g.append("path")
        .attr("class", "line2")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "1px")

// axis labels
    let xLabel = g.append("text")
        .attr("class", "x axisLabel")
        .attr("y", HEIGHT + 50)
        .attr("x", WIDTH / 2)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Week (2021)")
    let yLabel = g.append("text")
        .attr("class", "y axisLabel")
        .attr("transform", "rotate(-90)")
        .attr("y", -60)
        .attr("x", -170)
        .attr("font-size", "20px")
        .attr("text-anchor", "middle")
        .text("Deaths (weekly totals- discrete!)")

// scales
// let x = d3.scaleTime().range([0, WIDTH])
    let x = d3.scaleLinear().range([0, WIDTH]).domain([-1,51])  //fixme: needs to adjust to dates
    let y = d3.scaleLinear().range([HEIGHT, 0])
// y1
// let y1 = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 2600]);  //fixme: needs to adjust to data
    let y1 = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
    let xAxisCall = d3.axisBottom()
    let yAxisCall = d3.axisLeft()
        .ticks(6)
        .tickFormat(d => `${parseInt(d / 1000)}k`);
    let y1AxisCall = d3.axisRight()
        .ticks(6)
        .tickFormat(d => `${parseInt(d)}`);

//     .tickFormat(d => `${parseInt(d)}`)


//fixme: move to update
// svg.append("g")
//     .attr("class", "axisRed")
//     .attr("transform", `translate(${MARGIN.LEFT+WIDTH}, ${MARGIN.TOP})`)
//     .attr("stroke", "blue")
//     .call(d3.axisRight(y1));

// axis groups
    let xAxis = g.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${HEIGHT})`)
    let yAxis = g.append("g")
        .attr("class", "axisRed")
    let y1Axis = g.append("g")
        .attr("class", "axisRed2")
        .attr("stroke", "blue")
        .attr("transform", `translate(${WIDTH}, ${0})`)


// event listeners
    $("#state-select").on("change", update)
    // $("#var-select").on("change", update)

// add jQuery UI slider
//     $("#date-slider").slider({
//         range: true,
//         max: parseTime("31/10/2017").getTime(),
//         min: parseTime("12/5/2013").getTime(),
//         step: 86400000, // one day
//         values: [
//             parseTime("12/5/2013").getTime(),
//             parseTime("31/10/2017").getTime()
//         ],
//         slide: (event, ui) => {
//             $("#dateLabel1").text(formatTime(new Date(ui.values[0])))
//             $("#dateLabel2").text(formatTime(new Date(ui.values[1])))
//             update()
//         }
//     })

// d3.json("data/coins.json").then(data => {
//     // prepare and clean data
//     filteredData = {}
//     Object.keys(data).forEach(coin => {
//         filteredData[coin] = data[coin]
//             .filter(d => {
//                 return !(d["price_usd"] == null)
//             }).map(d => {
//                 d["price_usd"] = Number(d["price_usd"])
//                 d["24h_vol"] = Number(d["24h_vol"])
//                 d["market_cap"] = Number(d["market_cap"])
//                 d["date"] = parseTime(d["date"])
//                 return d
//             })
//     })
//
//     // run the visualization for the first time
//     update()
// })

    $.ajax({
        url: "https://data.cdc.gov/resource/r8kw-7aab.json",
        type: "GET",
        data: {
            "$limit" : 5000,
            "$$app_token" : "zZm4AtY5fjp7izQHUJVHK2Dhc"
        }
    }).done(function(data) {
        ddata = data;
        //alert("Retrieved " + data.length + " records from the dataset!");
        console.log(data);
        // prepare and clean data
        // console.log(ddata);
        // console.log("116");
        let filteredData = [];
        let fd2 = [];  // Fixme: use closure here so that update could access a local copy? using var or let here doesn't work.
        let stateChoice = $("#state-select").val()
        Object.keys(data).forEach(entry => {
            // console.log(entry);
            // console.log(data[entry]);
            if (data[entry]["state"] == "United States" && data[entry]["year"] == "2021") {
                console.log(entry);
                // filteredData[data[entry]["mmwr_week"]] = Number(data[entry]["mmwr_week"]);
                // filteredData[data[entry]["mmwr_week"]] = {week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])};
                filteredData.push({week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])});
            }
            // else if (data[entry]["state"] == "Texas" && data[entry]["year"] == "2021") {
            else if (data[entry]["state"] == stateChoice && data[entry]["year"] == "2021") {
                // console.log(entry);
                // filteredData[data[entry]["mmwr_week"]] = Number(data[entry]["mmwr_week"]);
                // filteredData[data[entry]["mmwr_week"]] = {week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])};
                fd2.push({week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])});
            }


            // filteredData[entry] = data[entry]
            // .filter(d => {
            //     return (d["state"] == "United States")
            // }).map(d => {
            //     d["covid_19_deaths"] = Number(d["covid_19_deaths"])
            //     d["mmwr_week"] = Number(d["mmwr_week"])
            //     d["market_cap"] = Number(d["market_cap"])
            //     d["pneumonia_influenza_or_covid_19_deaths"] = Number(d["pneumonia_influenza_or_covid_19_deaths"])
            //     // d["date"] = parseTime(d["date"])
            //     console.log(d)
            //     return d
            // })
        })
        console.log(filteredData);
        console.log("fd2");

        console.log(fd2);

        // run the visualization for the first time
        update(filteredData, fd2)
    });


    function update(filteredData, fd2) {
        let t = d3.transition().duration(1000)
        //
        // // filter data based on selections
        stateChoice = $("#state-select").val()
        console.log(stateChoice);
        fd2 = [];
        Object.keys(ddata).forEach(entry => {
            if (ddata[entry]["state"] == stateChoice && ddata[entry]["year"] == "2021") {
                fd2.push({week: Number(ddata[entry]["mmwr_week"]), deaths: Number(ddata[entry]["covid_19_deaths"])});
            }
        })
        g.append("text")
            .attr("x", (WIDTH / 2))
            .attr("y", 0 - (MARGIN.TOP / 2))
            .attr("class", "lineTitle")
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("text-decoration", "underline")
            .text(`US (red) and ${stateChoice} (blue) 2021 Weekly Covid Cases`);


        g.select(".lineTitle")
            .transition(t)
            .text(`US (red) and ${stateChoice} (blue) 2021 Weekly Covid Cases`);
        // let yValue = $("#var-select").val()
        // let sliderValues = $("#date-slider").slider("values")
        // let dataTimeFiltered = filteredData[state-choice].filter(d => {
        //     return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
        // })

        // update scales
        // x.domain(d3.extent([0,50]))
        // x.domain([-1,55])
        let delme_y1max = d3.max(fd2, d => d['deaths']) * 1.2
        y1.domain([0, delme_y1max])
        // y1.domain([0, 7000])
        y.domain([0, 30000
            // d3.min(dataTimeFiltered, d => d[yValue]) / 1.005,
            // d3.max(dataTimeFiltered, d => d[yValue]) * 1.005
        ])
        // delme_y1max = d3.max(fd2, d => d['deaths']) * 1.2
        // console.log(typeof(delme_y1max))
        // y1.domain([0, delme_y1max])
        // console.log(y1)
        // // fix for format values
        // let formatSi = d3.format(".2s")
        // function formatAbbreviation(x) {
        //     let s = formatSi(x)
        //     switch (s[s.length - 1]) {
        //         case "G": return s.slice(0, -1) + "B" // billions
        //         case "k": return s.slice(0, -1) + "K" // thousands
        //     }
        //     return s
        // }

        // update axes
        xAxisCall.scale(x)
        xAxis.transition(t).call(xAxisCall)
        yAxisCall.scale(y)
        y1AxisCall.scale(y1)
        // yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbreviation))
        yAxis.transition(t).call(yAxisCall)
        y1Axis.transition(t).call(y1AxisCall)
        // let y1 = d3.scaleLinear().range([HEIGHT, 0]).domain([0, 2600]);  //fixme: needs to adjust to data


        // // clear old tooltips
        // d3.select(".focus").remove()
        // d3.select(".overlay").remove()
        //
        // /******************************** Tooltip Code ********************************/
        //
        // let focus = g.append("g")
        //     .attr("class", "focus")
        //     .style("display", "none")
        //
        // focus.append("line")
        //     .attr("class", "x-hover-line hover-line")
        //     .attr("y1", 0)
        //     .attr("y2", HEIGHT)
        //
        // focus.append("line")
        //     .attr("class", "y-hover-line hover-line")
        //     .attr("x1", 0)
        //     .attr("x2", WIDTH)
        //
        // focus.append("circle")
        //     .attr("r", 7.5)
        //
        // focus.append("text")
        //     .attr("x", 15)
        //     .attr("dy", ".31em")
        //
        // g.append("rect")
        //     .attr("class", "overlay")
        //     .attr("width", WIDTH)
        //     .attr("height", HEIGHT)
        //     .on("mouseover", () => focus.style("display", null))
        //     .on("mouseout", () => focus.style("display", "none"))
        //     .on("mousemove", mousemove)
        //
        // function mousemove() {
        //     let x0 = x.invert(d3.mouse(this)[0])
        //     let i = bisectDate(dataTimeFiltered, x0, 1)
        //     let d0 = dataTimeFiltered[i - 1]
        //     let d1 = dataTimeFiltered[i]
        //     let d = x0 - d0.date > d1.date - x0 ? d1 : d0
        //     focus.attr("transform", `translate(${x(d.date)}, ${y(d[yValue])})`)
        //     focus.select("text").text(d[yValue])
        //     focus.select(".x-hover-line").attr("y2", HEIGHT - y(d[yValue]))
        //     focus.select(".y-hover-line").attr("x2", -x(d.date))
        // }
        //
        // /******************************** Tooltip Code ********************************/

        // Path generator
        let line = d3.line()
            .x(d => x(d.week))
            .y(d => y(d.deaths))

        let line2 = d3.line()
            .x(d => x(d.week))
            .y(d => y1(d.deaths))

        // Update our line path
        // g.select(".line")
        //     .transition(t)
        //     .attr("d", line(filteredData))

        g.select(".line")
            .transition(t)
            .attr("d", line(filteredData))

        g.select(".line2")
            .transition(t)
            .attr("d", line2(fd2))

        g.selectAll("myCircles")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("fill", "red")
            .attr("stroke", "none")
            .attr("cx", function(d) { return x(d.week) })
            .attr("cy", function(d) { return y(d.deaths) })
            .attr("r", 3)

        myCircles.exit().remove();
        // .attr("d", line(dataTimeFiltered))

        // Update y-axis label
        // let newText = (yValue === "price_usd") ? "Price ($)"
        //     : (yValue === "market_cap") ? "Market Capitalization ($)"
        //         : "24 Hour Trading Volume ($)"
        // yLabel.text(newText)
    }
}
lineDup1()