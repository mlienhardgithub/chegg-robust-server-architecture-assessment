const express = require("express");
const app = express();
app.use(express.json())

const uses = require("../data/uses-data");

//create

const bodyDataHas = (propertyName) => {
    return function (req, res, next) {
        const { data = {} } = req.body;
        if (data[propertyName]) {
            return next();
        }
        next({ 
            status: 400, 
            message: `Must include a ${propertyName}`
        });
    };
};

let lastId = uses.reduce((maxId, use) => Math.max(maxId, use.id), 0);

const create = (req, res) => {
    const { data: { urlId, time } = {} } = req.body;
    const newUse = {
        id: ++lastId, // Increment last id then assign as the current ID
        urlId,
        time
    };
    uses.push(newUse);
    res.status(201).json({ data: newUse });
};

//read: by id or list all

const list = (req, res) => {
    console.log('uses list');
    //{ mergeParams: true } in router.js gets the noteId req param
    const urlId = Number(req.params.urlId);
    console.log('uses urlId', urlId);
    //filters the uses by urlId if urlId is a route parameter.
    res.json({ data: 
        uses.filter(urlId ? use => use.urlId == urlId : () => true)
    });
    //res.json({ data: uses });
};

const useExists = (req, res, next) => {
    const useId = Number(req.params.useId);
    console.log('useId', useId);
    const foundUse = uses.find(use => use.id === useId);
    if (foundUse) {
        res.locals.use = foundUse;
        return next();
    }
    return next({
        status: 404,
        message: `Use id not found: ${useId}`,
    });
};

const read = (req, res, next) => {
    res.json({ data: res.locals.use });
};

//update

const update = (req, res) => {
    const use = res.locals.use;
    const { data: { urlId, time } = {} } = req.body;
    // Update the use
    use.urlId = urlId;
    use.time = time;
    res.json({ data: use });
};

//delete

const destroy = (req, res) => {
    const useId = Number(req.params.useId);
    console.log('useId', useId);
    const index = uses.findIndex((use) => use.id === useId);
    // `splice()` returns an array of the deleted elements, even if it is one element
    const deletedUse = uses.splice(index, 1);
    res.sendStatus(204);
};

module.exports = {
    //create: [bodyDataHas("time"), bodyDataHas("urlId"), create],
    list,
    read: [useExists, read],
    //update: [useExists, bodyDataHas("time"), bodyDataHas("urlId"), update],
    delete: [useExists, destroy],
    useExists
};
