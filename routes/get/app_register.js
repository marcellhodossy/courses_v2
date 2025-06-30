const express = require('express');
const router = express.Router();

router.get('/moderator', (req, res) => {
    res.redirect('/moderator/dashboard');
});

router.get('/users', (req, res) => {
    res.redirect('/users/dashboard')
});

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/settings/username_change', (req, res) => {
    res.redirect('/settings');
});

router.get('/settings/email_change', (req, res) => {
    res.redirect('/settings');
});

router.get('/settings/password_change', (req, res) => {
    res.redirect('/settings');
});

router.get('/moderator/course/create', (req, res) => {
    res.redirect('/moderator/dashboard');
});

router.get('/users/join/courses', (req, res) => {
    res.redirect('/users/dashboard');
});

router.get('/moderator/course/:id/edit_course', (req, res) => {
    res.redirect(`/users/course/${req.params.id}/edit`);
});

router.get('/moderator/course/:id/', (req, res) => {
    res.redirect(`/users/course/${req.params.id}/edit`);
});


module.exports = router;