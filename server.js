const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/studentDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Schema and Model
const studentSchema = new mongoose.Schema({
    username: String,
    branch: String,
    semester: Number
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/add-student', (req, res) => {
    const { username, branch, semester } = req.body;
    const newStudent = new Student({
        username,
        branch,
        semester
    });
    newStudent.save((err) => {
        if (err) {
            res.send(err);
        } else {
            res.redirect('/');
        }
    });
});

app.get('/students', (req, res) => {
    Student.find({ branch: 'CSE', semester: 6 }, (err, students) => {
        if (err) {
            res.send(err);
        } else {
            res.render('students', { students });
        }
    });
});

app.get('/all-students', (req, res) => {
    Student.find({}, (err, students) => {
        if (err) {
            res.send(err);
        } else {
            res.render('all-students', { students });
        }
    });
});

// Update student form
app.get('/update-student/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        res.render('update-student', { student });
    } catch (err) {
        res.send(err);
    }
});

// Update student logic
app.post('/update-student/:id', async (req, res) => {
    const { username, branch, semester } = req.body;
    try {
        await Student.findByIdAndUpdate(req.params.id, { username, branch, semester });
        res.redirect('/all-students');
    } catch (err) {
        res.send(err);
    }
});

// Delete student
app.get('/delete-student/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.redirect('/all-students');
    } catch (err) {
        res.send(err);
    }
});

// Server
const port = 5123;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
