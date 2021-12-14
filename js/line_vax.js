function lineVax1() {
    let stateDict = {"Montana": "MT", "California": "CA", "New York": "NY", "Georgia": "GA", "Texas": "TX"}
    let data;
    let ddata; // fixme: find better way to pass data to update?

    let MARGIN = {LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100}
    let WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
    let HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

    let svg = d3.select("#chart-area3").append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

    let g = svg.append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parsers/formatters
    let parseTime = d3.timeParse("%d/%m/%YT00:00:00:000")
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
    let x = d3.scaleLinear().range([0, WIDTH]).domain([-1, 51])  //fixme: needs to adjust to dates
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
    let stateChoice = stateDict[$("#state-select").val()]
    console.log(stateChoice)
    // $("#var-select").on("change", update)
    let filteredData = [];
    let fd2 = [];
    $.ajax({
        url: "https://data.cdc.gov/resource/rh2h-3yt2.json",
        type: "GET",
        data: {
            "$limit": 5000,
            "$where": `Location='${stateChoice}'`,
            "$$app_token": "zZm4AtY5fjp7izQHUJVHK2Dhc"
        }
    }).done(function (data) {
            ddata = data;
            console.log(ddata);
            // prepare and clean data
            filteredData = [];
            fd2 = [];  // Fixme: use closure here so that update could access a local copy? using var or let here doesn't work.
            stateChoice = stateDict[$("#state-select").val()]
            try {
                Object.keys(ddata).forEach(entry => {
                    // console.log("parsetime");
                    // console.log(ddata[entry]["date"].slice(0,4));
                    // console.log(ddata[entry]["date"]);
                    if (ddata[entry]["location"] === stateChoice && ddata[entry]["date"].slice(0, 4) === "2021" && ddata[entry]["date_type"]=== "Admin" ){
                        // console.log(entry);
                        // filteredData[ddata[entry]["mmwr_week"]] = Number(ddata[entry]["mmwr_week"]);
                        // filteredData[ddata[entry]["mmwr_week"]] = {week: Number(ddata[entry]["mmwr_week"]), deaths: Number(ddata[entry]["covid_19_deaths"])};
                        // filteredData.push({
                        //     week: Number(ddata[entry]["mmwr_week"]),
                        //     deaths: (Number(ddata[entry]["series_complete_cumulative"])*1.5)
                        // });
                        fd2.push({
                            week: Number(ddata[entry]["mmwr_week"]),
                            deaths: Number(ddata[entry]["series_complete_cumulative"])
                        });
                    }
                })
            } catch (err) {
                console.log(err)
            }
            console.log("fd2");

            console.log(fd2);
            // console.log(filteredData);


            // console.log(filteredData);
            console.log("fd2");

            console.log(fd2);

            // run the visualization for the first time
            // update(filteredData, fd2)
        }
    ).done(function () {
        $.ajax({
            url: "https://data.cdc.gov/resource/r8kw-7aab.json",
            type: "GET",
            data: {
                "$limit" : 5000,
                "$$app_token" : "zZm4AtY5fjp7izQHUJVHK2Dhc"
            }
    }).done(function (data) {
        //**********************
            filteredData = [];
            let stateChoice = $("#state-select").val()
            Object.keys(data).forEach(entry => {
                // console.log(entry);
                // console.log(data[entry]);
                // else if (data[entry]["state"] == "Texas" && data[entry]["year"] == "2021") {
                if (data[entry]["state"] == stateChoice && data[entry]["year"] == "2021") {
                    // console.log(entry);
                    // filteredData[data[entry]["mmwr_week"]] = Number(data[entry]["mmwr_week"]);
                    // filteredData[data[entry]["mmwr_week"]] = {week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])};
                    filteredData.push({week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])});
                }

        //********************8
    })

            console.log("FD2CCC")
            console.log(filteredData)
            update(filteredData, fd2)
    })



    })

    function update(filteredData, fd2) {
        console.log(g)
        console.log("fd2 in update")

        console.log(fd2)

        let stateDict = {"Montana": "MT", "California": "CA", "New York": "NY", "Georgia": "GA", "Texas": "TX"}

        stateChoice = stateDict[$("#state-select").val()]

        $.ajax({
            url: "https://data.cdc.gov/resource/rh2h-3yt2.json",
            type: "GET",
            data: {
                "$limit": 5000,
                "$where": `Location='${stateChoice}'`,
                "$$app_token": "zZm4AtY5fjp7izQHUJVHK2Dhc"
            }
        }).done(function (data) {
            ddata = data;
            //alert("Retrieved " + data.length + " records from the dataset!");
            console.log(data);
            // prepare and clean data
            // console.log(ddata);
            // console.log("116");
            let filteredData = [];
             fd2 = [];  // Fixme: use closure here so that update could access a local copy? using var or let here doesn't work.
            let stateChoice = stateDict[$("#state-select").val()]
            try {
                Object.keys(data).forEach(entry => {
                    // console.log("parsetime");
                    // console.log(data[entry]["date"].slice(0,4));
                    // console.log(data[entry]["date"]);
                    if (data[entry]["location"] === stateChoice && data[entry]["date"].slice(0, 4) === "2021" && data[entry]["date_type"]=== "Admin" ){
                        // console.log(entry);
                        // filteredData[data[entry]["mmwr_week"]] = Number(data[entry]["mmwr_week"]);
                        // filteredData[data[entry]["mmwr_week"]] = {week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])};
                        filteredData.push({
                            week: Number(data[entry]["mmwr_week"]),
                            deaths: (Number(data[entry]["series_complete_cumulative"])*1.5)
                        });
                        fd2.push({
                            week: Number(data[entry]["mmwr_week"]),
                            deaths: Number(data[entry]["series_complete_cumulative"])
                        });
                    }
                })
            } catch (err) {
                console.log(err)
            }}).done(function(){
            //**********************
            $.ajax({
                url: "https://data.cdc.gov/resource/r8kw-7aab.json",
                type: "GET",
                data: {
                    "$limit" : 5000,
                    "$$app_token" : "zZm4AtY5fjp7izQHUJVHK2Dhc"
                }

        }).done(function(data) {
            //**********************
            filteredData = [];
            let stateChoice = $("#state-select").val()
            Object.keys(data).forEach(entry => {
                // console.log(entry);
                // console.log(data[entry]);
                // else if (data[entry]["state"] == "Texas" && data[entry]["year"] == "2021") {
                if (data[entry]["state"] == stateChoice && data[entry]["year"] == "2021") {
                    // console.log(entry);
                    // filteredData[data[entry]["mmwr_week"]] = Number(data[entry]["mmwr_week"]);
                    // filteredData[data[entry]["mmwr_week"]] = {week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])};
                    filteredData.push({week: Number(data[entry]["mmwr_week"]), deaths: Number(data[entry]["covid_19_deaths"])});
                }

                //********************8
            })

            console.log("Filtered again")
            console.log(filteredData)




        // closing



            let t = d3.transition().duration(1000)
            let t2 = d3.transition().duration(1700)

            //
            // // filter data based on selections
            stateChoice = stateDict[$("#state-select").val()]
            console.log(stateChoice);
            // g.select(".lineTitle")
            //     .exit().remove();




            g.append("text")
                .attr("x", (WIDTH / 2))
                .attr("y", 0 - (MARGIN.TOP / 2))
                .attr("class", "lineTitle")
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("text-decoration", "underline")
                .text(`Deaths (grey) and total vaccinations (blue) for ${stateChoice} 2021 Weekly Covid Cases`);


            g.select(".lineTitle")
                .transition(t)
                .attr("x", (WIDTH / 2))
                .attr("y", 0 - (MARGIN.TOP / 2))
                .attr("class", "lineTitle")
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("text-decoration", "underline")
                .text(`Deaths (grey) and total vaccinations (blue) for ${stateChoice} 2021 Weekly Covid Cases`);
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
            let delme_ymax = d3.max(filteredData, d => d['deaths']) * 1.2

            y.domain([0, delme_ymax])
                // d3.min(dataTimeFiltered, d => d[yValue]) / 1.005,
                // d3.max(dataTimeFiltered, d => d[yValue]) * 1.005

            // update axes
            xAxisCall.scale(x)
            xAxis.transition(t).call(xAxisCall)
            yAxisCall.scale(y)
            y1AxisCall.scale(y1)
            // yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbreviation))
            yAxis.transition(t).call(yAxisCall)
            y1Axis.transition(t).call(y1AxisCall)
            // Path generator
            let line = d3.line()
                .x(d => x(d.week))
                .y(d => y(d.deaths))

            let line2 = d3.line()
                .x(d => x(d.week))
                .y(d => y1(d.deaths))

            g.select(".line")
                .transition(t)
                .attr("d", line(filteredData))

            g.select(".line2")
                .transition(t2)
                .attr("d", line2(fd2))

            // g.selectAll("myCircles")
            //     .data(filteredData)
            //     .enter()
            //     .append("circle")
            //     .attr("fill", "red")
            //     .attr("stroke", "none")
            //     .attr("cx", function (d) {
            //         return x(d.week)
            //     })
            //     .attr("cy", function (d) {
            //         return y(d.deaths)
            //     })
            //     .attr("r", 3)
            //
            // myCircles.exit().remove();
            // .attr("d", line(dataTimeFiltered))

            // Update y-axis label
            // let newText = (yValue === "price_usd") ? "Price ($)"
            //     : (yValue === "market_cap") ? "Market Capitalization ($)"
            //         : "24 Hour Trading Volume ($)"
            // yLabel.text(newText)
        })
    })
}}


lineVax1()