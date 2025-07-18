const express = require('express');
const session = require('express-session');
const app = express();
const pg = require('pg');
const PgSession = require('connect-pg-simple')(session);
const dotenv = require('dotenv').config();


const CookieParser = require('cookie-parser');

const {
    pool
} = require("./config/postgresql.js");

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 24 * 3600 * 1000
    },
    store: new PgSession({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    })
}));

app.use(CookieParser());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const login = require('./routes/get/default_auth/login.js');
const register = require('./routes/get/default_auth/register.js');
const resend = require('./routes/get/verify_register/resend.js');
const verify = require('./routes/get/verify_register/verify.js');
const password_forgot = require('./routes/get/password_reset/password_forgot.js');
const password_reset = require('./routes/get/password_reset/password_reset.js');
const password_ok = require('./routes/get/password_reset/password_ok.js');
const user_dashboard = require('./routes/get/users/user_dashboard.js');
const user_join = require('./routes/get/users/user_join.js');
const moderator_dashboard = require('./routes/get/moderator/moderator_dashboard.js');
const deletecourse = require('./routes/get/moderator/moderator_delete.js');
const editcourse = require('./routes/get/moderator/moderator_edit.js');
const moderator_managment = require('./routes/get/moderator/managment.js');
const moderator_unactive = require('./routes/get/moderator/unactive.js');
const moderator_kick = require('./routes/get/moderator/kick.js');
const moderator_delete = require('./routes/get/moderator/delete.js');
const moderator_edit = require('./routes/get/moderator/edit.js');
const moderator_demote = require('./routes/get/moderator/demote.js');
const moderator_promote = require('./routes/get/moderator/promote.js');
const users_posts = require('./routes/get/users/user_course.js');
const users_leave = require('./routes/get/users/leave.js');
const selector = require('./routes/get/selector.js');
const app_register = require('./routes/get/app_register.js');
const settings = require('./routes/get/settings.js');
const logout = require('./routes/get/users/logout.js');
const moderator_edit_course = require('./routes/post/moderator/edit_course.js');

const loginRoutes = require('./routes/post/default_auth/login.js');
const registerRoutes = require('./routes/post/default_auth/register.js');
const passwordforgotRoutes = require('./routes/post/forgot_password/password_forgot.js');
const passwordresetRoutes = require('./routes/post/forgot_password/password_reset.js');
const joinPrivateRoutes = require('./routes/post/users/private_course.js');
const createCourses = require('./routes/post/moderator/create.js');
const generateCode = require('./routes/post/moderator/generatecode.js');
const newpost = require('./routes/post/moderator/addpost.js');
const moderator_editpost = require('./routes/post/moderator/edit_post.js');
const settings_newpasswd = require('./routes/post/settings/password_change.js');
const settings_newemail = require('./routes/post/settings/email_change.js');
const settings_newusername = require('./routes/post/settings/username_change.js');

app.use(login);
app.use(register);
app.use(resend);
app.use(verify);
app.use(password_forgot);
app.use(password_reset);
app.use(password_ok);
app.use(user_dashboard);
app.use(user_join);
app.use(moderator_dashboard)
app.use(deletecourse);
app.use(editcourse);
app.use(moderator_managment);
app.use(moderator_unactive);
app.use(moderator_kick);
app.use(moderator_delete);
app.use(moderator_edit);
app.use(users_posts);
app.use(users_leave);
app.use(selector);
app.use(app_register);
app.use(settings);
app.use(logout);
app.use(moderator_demote);
app.use(moderator_promote);

app.use(loginRoutes);
app.use(registerRoutes);
app.use(passwordforgotRoutes);
app.use(passwordresetRoutes);
app.use(joinPrivateRoutes);
app.use(createCourses);
app.use(generateCode);
app.use(newpost);
app.use(moderator_editpost);
app.use(settings_newpasswd);
app.use(settings_newusername);
app.use(settings_newemail);
app.use(moderator_edit_course);

app.listen(process.env.PORT, () => {
    console.log(`server listened: localhost:${process.env.PORT}`);
});