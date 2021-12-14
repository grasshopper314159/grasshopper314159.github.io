function bardup2()
{
    // FIXME: MAKE A META DATA STRUCTURE TO HOLD STATE, MAX, ETC?
    let barData = {
        "max": 0,
        "state": "Texas",
        "0-17 years": [],
        "18-29 years": [],
        "30-39 years": [],
        "40-49 years": [],
        "50-64 years": [],
        "65-74 years": [],
        "75-84 years": [],
        "85 years and over": []
    };
    ages = ["0-17 years",
        "18-29 years",
        "30-39 years",
        "40-49 years",
        "50-64 years",
        "65-74 years",
        "75-84 years",
        "85 years and over"]
    let bd3 = []
    let MARGIN = {LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 120}
    let WIDTH = 400 - MARGIN.LEFT - MARGIN.RIGHT
    let HEIGHT = 300 - MARGIN.TOP - MARGIN.BOTTOM

    let svg = d3.select("#chart-area2").append("svg")
        .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
        .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

    let g = svg.append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)
    let x = d3.scaleBand()
        .range([0, WIDTH])
        .paddingInner(0.3)
        .paddingOuter(0.2)

    let y = d3.scaleLinear().range([HEIGHT, 0])
    let yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(d => d)
    let yAxis = g.append("g")
        .attr("class", "y axis")
    // .call(yAxisCall)
    // event listeners
    $("#state-select").on("change", update)
    $("#var-select").on("change", update)
    // let stateChoice = $("#state-select").val()
    let stateChoice = "United States"
    $.ajax({
        url: "https://data.cdc.gov/resource/9bhg-hcku.json?",
        type: "GET",
        data: {
            "$limit": 2000,
            "$where": `state='${stateChoice}'`,
            "$$app_token": "zZm4AtY5fjp7izQHUJVHK2Dhc"
        }
    }).done(function (data) {
        console.log(data);
        let filteredData = [];
        let fd2 = [];  // Fixme: use closure here so that update could access a local copy? using var or let here doesn't work.
        // stateChoice = $("#state-select").val()
        Object.keys(data).forEach(entry => {
            if (data[entry]["sex"] === "All Sexes"
                && data[entry]["year"] == "2021"
                && data[entry]["group"] == "By Year") {
                temp_age = data[entry]["age_group"].toString()
                temp_deaths = +data[entry]["covid_19_deaths"]
                if (isNaN(temp_deaths)) temp_deaths = 0;

                try {
                    barData[temp_age].push(temp_deaths)
                    if (temp_deaths > barData['max']) barData['max'] = temp_deaths
                    console.log(temp_age)
                    bd3.push({age: temp_age, deaths: temp_deaths})
                } catch (err) {

                }
            }
        })
        g.append("text")
            .attr("class", "x axis-label")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 100)
            .attr("font-size", "14px")
            .attr("text-anchor", "middle")
            .text("Age Range")

        // Y label
        g.append("text")
            .attr("class", "y axis-label")
            .attr("x", -(HEIGHT / 2))
            .attr("y", -60)
            .attr("font-size", "14px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Total Deaths")
        // do it
        update()
    });


    function update() {
        // d3.select("#mySvg").remove();
        // d3.select("g").remove();
        // d3.select("y").remove();

        console.log("updating:");
        console.log(bd3);
        // stateChoice = $("#state-select").val()
        console.log(stateChoice);
        let t = d3.transition().duration(500)

        $.ajax({
            url: "https://data.cdc.gov/resource/9bhg-hcku.json?",
            type: "GET",
            data: {
                "$limit": 2000,
                "$where": `state='${stateChoice}'`,
                "$$app_token": "zZm4AtY5fjp7izQHUJVHK2Dhc"
            }
        }).done(function (data) {
            console.log(data);
            // filteredData = [];
            // fd2 = [];  // Fixme: use closure here so that update could access a local copy? using var or let here doesn't work.
            // stateChoice = $("#state-select").val()
            bd3 = []
            Object.keys(data).forEach(entry => {
                if (data[entry]["sex"] === "All Sexes"
                    && data[entry]["year"] == "2021"
                    && data[entry]["group"] == "By Year") {
                    let temp_age = data[entry]["age_group"].toString()
                    let temp_deaths = +data[entry]["covid_19_deaths"]
                    try {
                        barData[temp_age].push(temp_deaths)
                        if (temp_deaths > barData['max']) barData['max'] = temp_deaths
                        console.log(temp_deaths)
                        // bd2.push(temp_deaths)
                        if (isNaN(temp_deaths)) temp_deaths = 0;
                        console.log(temp_deaths)

                        bd3.push({age: temp_age, deaths: temp_deaths})
                    } catch (err) {

                    }
                }
            })
            // move me

            console.log(bd3.length)

            // x.domain(bd3.map(function (value, i) { return i;}))
            x.domain(bd3.map(function (d) {
                return d.age;
            }))
            // svg.select('y axis').remove()
            // .remove();
            //     d3.select(g)
            //         .text()
            //         .remove()
            y.domain([0, d3.max(bd3, function (d) {
                return d.deaths;
            })])
            //     = d3.scaleLinear()
            //     .domain([0, barData['max']])
            //     .range([HEIGHT, 0])
            // y.domain([0, d3.max(bd3, function(d) {return d.deaths;})])
            let xAxisCall = d3.axisBottom(x)
            g.append("g")
                .attr("class", "x axis")
                .attr("transform", `translate(0, ${HEIGHT})`)
                .call(xAxisCall)
                .selectAll("text")
                .attr("y", "20")
                .attr("x", "45")
                .attr("text-anchor", "front")
                .attr("transform", "rotate(40)")

            g.append("text")
                .attr("x", (WIDTH / 2))
                .attr("y", 0 - (MARGIN.TOP / 2))
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("text-decoration", "underline")
                .text(`${stateChoice} Demographics`);
            //
            // let yAxisCall = d3.axisLeft(y)
            //     .ticks(3)
            //     .tickFormat(d => d)
            // g.append("g")
            //     .attr("class", "y axis")
            //     .call(yAxisCall)
            yAxisCall.scale(y)
            // xAxisCall.scale(x)
            // xAxis.transition(t).call(xAxisCall)
            yAxis.transition(t).call(yAxisCall)

            console.log(bd3)
            let rects = g.selectAll("rect")
                .data(bd3)
            console.log(rects)
            rects.exit().remove();

            rects
                .transition(t)
                .attr("y", d => y(d.deaths))
                .attr("x", (d) => x(d.age))  // not wokring at alll, should generate
                .attr("width", x.bandwidth)
                .attr("height", d => HEIGHT - y(d.deaths))
                .attr("fill", "grey")

            rects.enter().append("rect")
                .transition(t)
                .attr("y", d => y(d.deaths))
                .attr("x", (d) => x(d.age))  // not wokring at alll, should generate
                .attr("width", x.bandwidth)
                .attr("height", d => HEIGHT - y(d.deaths))
                .attr("fill", "grey")


            // g.selectAll("rect")
            //     .data(bd3)
            //     .exit().remove()
            // let rects2 = g.selectAll("rect")
            //     .data(bd3)
            // rects2.exit()
            //     .transition(t)
            //     .remove()


        })
    };
    //***************************
}
bardup2()