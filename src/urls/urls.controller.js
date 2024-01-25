const express = require("express");
const app = express();
app.use(express.json())

const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

//create

const hasHref = (req, res, next) => {
    const { data: { href } = {} } = req.body;
    if (href) {
        return next();
    }
    return next({ status: 400, message: "A 'href' property is required." });
  }

let lastId = urls.reduce((maxId, url) => Math.max(maxId, url.id), 0);

const create = (req, res) => {
    const { data: { href } = {} } = req.body;
    const newUrl = {
        id: ++lastId, // Increment last id then assign as the current ID
        href
    };
    urls.push(newUrl);
    res.status(201).json({ data: newUrl });
};

//read: by id or list all

const list = (req, res) => {
    console.log('urls list');
    res.json({ data: urls });
};

const urlExists = (req, res, next) => {
    const urlId = Number(req.params.urlId);
    console.log('urlId', urlId);
    const foundUrl = urls.find(url => url.id === urlId);
    if (foundUrl) {
        res.locals.url = foundUrl;
        return next();
    }
    return next({
        status: 404,
        message: `Url id not found: ${urlId}`,
    });
};

const read = (req, res, next) => {
    let lastUseId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0);
    console.log('urls lastUseId', lastUseId);
    const newUse = {
        id: ++lastUseId, // Increment last id then assign as the current ID
        urlId: res.locals.url.id,
        time: Date.now()
    };
    uses.push(newUse);
    
    res.json({ data: res.locals.url });
};

//update

const update = (req, res) => {
    const url = res.locals.url;
    const { data: { href } = {} } = req.body;
    // Update the url
    url.href = href;
    res.json({ data: url });
};

//delete

const destroy = (req, res) => {
    const urlId = Number(req.params.urlId);
    console.log('urlId', urlId);
    const index = urls.findIndex((url) => url.id === urlId);
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedUrl = urls.splice(index, 1);
    res.sendStatus(204);
};

module.exports = {
    create: [hasHref, create],
    list,
    read: [urlExists, read],
    update: [urlExists, hasHref, update],
    //delete: [urlExists, destroy],
    urlExists
};
