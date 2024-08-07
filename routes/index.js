var express = require('express');
const User = require('../models/user');
const Article = require('../models/article');
const Page = require('../models/page');
let mongoose = require('mongoose');
var geoip = require('geoip-lite');
const SitemapGenerator = require('sitemap-generator');

var router = express.Router();

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

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Home
router.get('/', isAuthorised, async (req, res, next) => {
  try {

  } catch (error) {
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

// Login
router.get('/auth/login', isNotAuthorised, async (req, res, next) => {
  try {
    res.render('login', {
      title: "LogIn"
    });
  } catch (error) {
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
