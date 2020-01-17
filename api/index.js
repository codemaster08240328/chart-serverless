'user strict';

require("chart.js");
const express = require('express');
const { CanvasRenderService } = require("chartjs-node-canvas");
const fs = require('fs')
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

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
    const bucketName = 'charts.methoddata.com';
    
    const fileName = "charts/Pipeline-" + new Date().toISOString() + '.png';
    
    s3.upload({
        Key: fileName,
        Body: buffer,
        Bucket: bucketName,
        ContentType: 'image/png'
    }, (err, data) => {
        console.log('err', err)
        console.log('data', data)
        res.json({err, data});
    })
})

module.exports = router;