'user strict';

require("chart.js");
const express = require('express');
const { CanvasRenderService } = require("chartjs-node-canvas");
const fs = require('fs')

const router = express.Router();

const chartCallback = (ChartJS) => {
    ChartJS.defaults.global.responsive = true;
    ChartJS.defaults.global.maintainAspectRatio = false;
};

const drawChart = async (data) => {
    const { type, data: { labels, datasets }, options } = data;

    const configuration = {
        type,
        data: {
             labels,
             datasets
        },
        options,
    };

    const canvasRenderService = new CanvasRenderService(
        400,
        400,
        chartCallback,
    )

    return await canvasRenderService.renderToBuffer(configuration)
}

router.post('/chart', async(req, res) => {
    const data = req.body 

    const buffer = await drawChart(data);
    
    fs.writeFileSync('./img/chartjs-example.png', buffer)
    res.json({data});
})

module.exports = router;