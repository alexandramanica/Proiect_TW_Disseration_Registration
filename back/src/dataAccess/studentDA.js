import Student from "../entities/Student.js";

const createStudent = async (studentData) => {
    try {
      console.log('Received data in createStudent:', studentData);
      const newStudent = await Student.create(studentData);
      console.log('Student created:', newStudent);
      return newStudent;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  };
  

async function getStudents() {
    return await Student.findAll();
}

async function getStudentById(id) {
    return await Student.findByPk(id);
}

async function deleteStudent(id) {
    let student = await Student.findByPk(id);

    if (!student) {
        console.log("This student has already been deleted");
        return;
    }

    return await student.destroy();
}

//functie de select dupa email si parola
const loginStudent = async (email, password) => {
  try {
    const student = await Student.findOne({
      where: {
        StudentEmail: email,
        StudentPassword: password,
      },
    });

    return student;
  } catch (error) {
    console.error('Error finding student:', error);
    throw error;
  }
};

export {
    createStudent,
    getStudentById,
    getStudents,
    deleteStudent,
    loginStudent
}
