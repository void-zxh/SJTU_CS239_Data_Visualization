// HistogramPlot.js

// 数据类别索引
let type_index = 0;

// 类名列表
let type_name_list = [];

// 选择要展示哪一类数据
// index = 0: Area; 1: Group; 2: Reservation; 3: Client's age; 4: Gender; 5: Occupancy
function choose_data_type(table, index) {
    switch (index) {
        case 0:
            // Area
            type_index = 0;
            type_name_list = ["Local", "USA", "SA", "EU", "MEA", "ASIA"];
            console.log("Index for Area...");
            break;
        case 1:
            // Group
            type_index = 1;
            type_name_list = ["Businessmen", "Tourists"];
            console.log("Index for Group...");
            break;
        case 2:
            // Reservation
            type_index = 2;
            type_name_list = ["DR", "Agency", "AC"];
            console.log("Index for Reservation...");
            break;
        case 3:
            // Client's age
            type_index = 3;
            type_name_list = ["U20", "20to35", "35to55", "M55"];
            console.log("Index for Client's age...");
            break;
        case 4:
            // Gender
            type_index = 4;
            type_name_list = ["Female"];
            console.log("Index for Gender...");
            break;
        case 5:
            // Occupancy
            type_index = 5;
            type_name_list = ["Occupancy"];
            console.log("Index for Occupancy...");
            break;
        default:
            console.log("Error occurred in index choosing...");
            break;
    }

    // Plot
    plot_histogram(table);
}

// 根据选择的类别生成相应的数据集
function generate_dataset(ori_dataset) {
    let ret = [];
    let idx = 0;
    for (let i = 0; i < ori_dataset.length; i++) {
        switch (type_index) {
            case 0:
                // Area
                if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5 || i ===6) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 1:
                // Group
                if (i === 7 || i === 8) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 2:
                // Reservation
                if (i === 9 || i === 10 || i === 11) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 3:
                // Client's age
                if (i === 12 || i === 13 || i === 14 || i === 15) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 4:
                // Gender
                if (i === 0) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            case 5:
                // Occupancy
                if (i === 18) {
                    ret[idx] = [];
                    for (let j = 0; j < ori_dataset[i].length; j++) {
                        ret[idx][j] = ori_dataset[i][j];
                    }
                    idx++;
                }
                break;
            default:
                break;
        }
    }
    return ret;
}

// 绘制直方图
function plot_histogram(table) {
    // column_index为当前选中的列数，全局变量，定义在Utils.js
    if(column_index <= 0) {
        console.log("Invalid Index Error. The column index is:", column_index);
        return 0;
    }

    // 删除旧的SVG，若无svg，selectAll()方法会创建一个空选择集并返回
    if (!d3.select("body").selectAll("svg").filter(".myHistogramSVG").empty()) {
        d3.select("body").selectAll("svg").filter(".myHistogramSVG").remove();
        console.log("Remove histogram...");
    }

    // 设置幕布尺寸
    let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    width *= 0.7;
    height *= 0.5;
    // 创建SVG
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .classed("myHistogramSVG", true);

    // 数据处理
    // get_table_data(table) 函数返回数据类型为string，需要转化为double，否则在比较大小时会把9判定为大于23
    // 注意若为空，则在画图时默认为0
    let ori_dataset = get_table_data(table);
    for (let i = 0; i < ori_dataset.length; i++) {
        for (let j = 0; j < ori_dataset[0].length; j++) {
            if (ori_dataset[i][j] !== "") {
                ori_dataset[i][j] = parseFloat(ori_dataset[i][j]);
            } else {
                ori_dataset[i][j] = 0;
            }
        }
    }
    console.log(ori_dataset)
    // console.log(d3.max(dataset))

    // 根据选择的类别生成相应的数据集
    let dataset = generate_dataset(ori_dataset);

    console.log(dataset)

    // 颜色块设置
    let color_scale = d3.scaleOrdinal()
        .domain(d3.range(0, dataset[0].length))
        .range(d3.schemeSet1);

    // x坐标轴设置
    // 比例尺
    let x_scale = d3.scaleLinear()
        .domain([0, dataset[0].length])
        .range([(width / (dataset[0].length + 5)), 13 * (width / (dataset[0].length + 5))]);

    let x_axis = d3.axisBottom()            // axisBottom表示数字显示在坐标轴的下方
        .scale(x_scale)
        .ticks(dataset[0].length);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "x_axis")
        .attr('transform', `translate(0, ${height - (height / 15)})`)           // 访问变量
        .call(x_axis);
    // y坐标轴设置
    // 比例尺
    let y_scale = d3.scaleLinear()
        // .domain([0, d3.max(dataset)])
        .domain([0, 100])
        // .range([(height / 20), height * (19 / 20)]);
        .range([height * (14 / 15), (height / 15)]);

    let y_axis = d3.axisLeft()            // axisBottom表示数字显示在坐标轴的下方
        .scale(y_scale)
        .ticks(10);
    // SVG添加坐标轴
    svg.append("g")
        .attr("class", "y_axis")
        .attr('transform', `translate(${(width / (dataset[0].length + 5))}, 0)`)           // 访问变量
        .call(y_axis);

    let prev_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let cur_sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // 注意，必须要这样才能重复添加矩形！
    let histogram = svg.selectAll("rect");

    for (let j = 0; j < dataset.length; j++) {
        console.log(j);
        // 绘制矩形
        histogram.data(dataset[j])
            .enter()
            .append("rect")
            .attr("x", function (d, i) { return (i + 1.6) * (width / (dataset[0].length + 5)); })
            .attr("y", function (d) { return height * (14 / 15); })
            .attr("width", (width / (dataset[0].length + 5)) * 0.8)
            .attr("height", 0)
            .attr("fill", function (d, i) { return color_scale(j); })
            .on("mouseover", function (d) {
                d3.select(this)
                    .attr("fill", function (d, i) { return 'rgba(65, 105, 225)'; });
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("fill", function (d, i) { return color_scale(j); });
            })
            .transition()               // 动画效果
            .duration(1000)
            .ease(d3.easeCubicInOut)
            .attr("height", function (d, i) {
                cur_sum[i] += d;
                console.log(cur_sum[i]);
                return Math.abs((d / 100) * (13 / 15) * height);
            })
            // .attr("height", function (d) { return Math.abs((d / d3.max(dataset)) * (13 / 15) * height); })
            .attr("y", function (d, i) {
                let ret = height - ((d + prev_sum[i]) / 100) * (13 / 15) * height - (height / 15);
                prev_sum[i] = cur_sum[i];
                return ret;
            });
            // .attr("y", function (d) { return height - (d / d3.max(dataset)) * (13 / 15) * height - (height / 15); });
        console.log(cur_sum);
        console.log(prev_sum);
    }

    // 图例，容器
    let legend = svg.append("g")
        .attr("transform", `translate(${14 * (width / (dataset[0].length + 5))}, ${height / 15})`)
        .selectAll("g")
        // .data(draw_data)
        .data(type_name_list)
        .enter()
        .append("g")
        .attr("transform", function(d, i) {return `translate(0, ${i * height / 15})`});

    // 图例中的颜色条
    legend.append("rect")
        .attr("width", width / 30)
        .attr("height", height / 20)
        // .attr("fill", function (d) {return color_scale(d.index)});
        .attr("fill", function (d, i) {return color_scale(i)});

    // 图例中的文字
    legend.append("text")
        // .text(function (d) {return d.data.key})
        .text(function (d) {return d;})
        .style("font-size", 13)
        .attr("y", "1em")
        .attr("x", "4em")
        .attr("dy", 3)

    // 创建表格名称
    let header_text = "Histogram for Hotel Data";
    svg.append("text")
        .text(header_text)
        .style("font-size", "1vw")
        .attr("x", (width / 2))
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("y", (height / 50));
}