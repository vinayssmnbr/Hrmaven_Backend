var express = require('express');
exports.login = async function(req,res)
{
    res.send('login hit it');
}

exports.signup = async function(req,res)
{
    res.send('signup hit it');
}

