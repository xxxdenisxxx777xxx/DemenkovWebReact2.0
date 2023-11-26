const express = require('express');
const app = express();
app.use(express.json());

let students = [
  { studentId: 10, firstName: "Marty", lastName: "McFly", groupId: 101, grade: 9.5 },
  { studentId: 11, firstName: "Squidward", lastName: "Tentakles", groupId: 102, grade: 6.1 },
  { studentId: 12, firstName: "Donald", lastName: "Duck", groupId: 102, grade: 7.2 },
  { studentId: 13, firstName: "Sarah", lastName: "Connor", groupId: 101, grade: 8.3 },
  { studentId: 14, firstName: "Yugin", lastName: "Krabbs", groupId: 102, grade: 6.8 },
];

function validateFields(req, res, next) {
  const { firstName, lastName } = req.body;
  if (!firstName || !lastName) {
    return res.status(400).json({ error: "Необходимо указать имя и фамилию." });
  }
  next();
}

app.get('/students', (req, res) => {
  res.json(students);
});

app.post('/students', validateFields, (req, res) => {
  const newStudent = req.body;
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.get('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students.find(student => student.studentId === studentId);
  if (!student) {
    return res.status(404).json({ error: "Студент не найден." });
  }
  res.json(student);
});

app.put('/students/:id', validateFields, (req, res) => {
  const studentId = parseInt(req.params.id);
  const updatedStudent = req.body;
  let studentFound = false;

  students = students.map(student => {
    if (student.studentId === studentId) {
      studentFound = true;
      return { ...student, ...updatedStudent, studentId };
    }
    return student;
  });

  if (!studentFound) {
    return res.status(404).json({ error: "Студент не найден." });
  }

  res.json(updatedStudent);
});

app.delete('/students/:id', (req, res) => {
  const studentId = parseInt(req.params.id);
  const initialLength = students.length;
  students = students.filter(student => student.studentId !== studentId);

  if (students.length === initialLength) {
    return res.status(404).json({ error: "Студент не найден." });
  }

  res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен ${PORT}`);
});
