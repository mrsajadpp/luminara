var express = require('express');
const crypash = require('crypash');
var router = express.Router();
const User = require('../models/user');
const Code = require('../models/code');
const Article = require('../models/article');
const ArticleBin = require('../models/artBin');
const userBin = require('../models/userBin');
const Page = require('../models/page');
const Updation = require('../models/updation');
const ArticleDraft = require('../models/articleDraft');
const ArticleEditsBin = require('../models/editBin');
let mail = require('../email/config');
var geoip = require('geoip-lite');
let axios = require('axios');
let fs = require('fs');
let path = require('path');
const CleanCSS = require('clean-css');
const { minify } = require('uglify-js');
const minifyHTML = require('html-minifier');
let { sendMail } = require('../email/config')
const speakeasy = require('speakeasy');
// const sharp = require('sharp');
const webp = require('webp-converter');
const { exec } = require('child_process');


const { default: mongoose } = require('mongoose');
const { ObjectId } = require('mongodb');
const { generateKey } = require('crypto');

// Generate a secret key with a length 
// of 20 characters 
const secret = speakeasy.generateSecret({ length: 20 });

// Function to convert timestamp to DD/MM/YYYY format
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based) and pad with leading zero if necessary
    const year = date.getFullYear(); // Get full year
    return `${day}-${month}-${year}`;
}

// Function to add one day to a given timestamp and return the new date in DD/MM/YYYY format
function addOneDay(timestamp) {
    const date = new Date(timestamp);
    date.setDate(date.getDate() + 1); // Add one day
    const day = date.getDate().toString().padStart(2, '0'); // Get day and pad with leading zero if necessary
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (zero-based) and pad with leading zero if necessary
    const year = date.getFullYear(); // Get full year
    return `${day}/${month}/${year}`;
}

const isAdmin = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/auth/login');
    } else {
        if (!req.session.user.admin) {
            res.redirect('/');
        } else {
            next();
        }
    }
}

function generateOneTimeCode(string1, string2) {
    // Concatenate the two strings
    const combinedString = string1 + string2;

    // Generate a hash of the concatenated string using SHA256 algorithm
    const hash = crypto.createHash('sha256').update(combinedString).digest('hex');

    // Extract the first 6 characters of the hash to create the one-time code
    const oneTimeCode = hash.substring(0, 9);

    return oneTimeCode;
}

function convertToSlug(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}



const isAuthorised = (req, res, next) => {
    try {
        if (!req.session.logged) {
            res.redirect('/auth/login');
        } else {
            next();
        }
    } catch (error) {
        console.error(error);
        console.error("Error:", err);
    }
}

const isNotAuthorised = (req, res, next) => {
    try {
        if (!req.session.logged) {
            next();
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        console.error("Error:", err);
    }
}

// login
router.post('/auth/login', isNotAuthorised, async (req, res, next) => {
    const { username, password } = req.body;

    // Form validation
    if (!username) {
        return res.render('user/login', { title: "Login", style: ['regform'], user: req.session && req.session.user ? req.session.user : false, data: req.body, error: { message: 'Username is required.' } });
    }
    if (!password) {
        return res.render('user/login', { title: "Login", style: ['regform'], user: req.session && req.session.user ? req.session.user : false, data: req.body, error: { message: 'Password is required.' } });
    }

    try {
        if (username == 'admin' && password == 'AdminLuminaraNhss') {
            req.session.logged = true;
        } else {
            req.session.logged = false;
            return res.render('user/login', { title: "Login", style: ['regform'], user: req.session && req.session.user ? req.session.user : false, data: req.body, error: { message: 'Credentials not matching.' } });
        }
    } catch (error) {
        console.error(error);
        res.render('error', { title: "500", status: 500, message: error.message, style: ['error'], user: req.session && req.session.user ? req.session.user : false });
    }
});


// Logout
router.get('/logout', isAuthorised, async (req, res, next) => {
    try {
        // Destroy the session
        req.session.logged = false;

        // Redirect to login page
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        console.error(error);
        res.render('error', {
            title: "500",
            status: 500,
            message: error.message,
            style: ['error'],
            user: req.session && req.session.user ? req.session.user : false
        });
    }
});

module.exports = router;