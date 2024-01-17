import Teacher from "../entities/Teacher.js";

const createTeacher = async (teacherData) => {
    try {
        console.log('Received data in createTeacher:', teacherData);
        const newTeacher = await Teacher.create(teacherData);
        console.log('Teacher created:', newTeacher);
        return newTeacher;
    } catch (error) {
        console.error('Error creating teacher:', error);
        throw error;
    }
};

async function getTeachers() {
    return await Teacher.findAll();
}

async function getTeacherById(id) {
    return await Teacher.findByPk(id);
}

async function deleteTeacher(id) {
    let teacher = await Teacher.findByPk(id);

    if (!teacher) {
        console.log("This teacher has already been deleted");
        return;
    }

    return await teacher.destroy();
}

// Funcție de autentificare după email și parolă
const loginTeacher = async (email, password) => {
    try {
        const teacher = await Teacher.findOne({
            where: {
                TeacherEmail: email,
                TeacherPassword: password,
            },
        });

        return teacher;
    } catch (error) {
        console.error('Error finding teacher:', error);
        throw error;
    }
};

async function updateTeacher(id, teacherData) {
    try {
        const existingTeacher = await Teacher.findByPk(id);
  
        if (!existingTeacher) {
            return { error: true, msg: "No entity found" };
        }
  
        await existingTeacher.update(teacherData);
        console.log('Request updated successfully.');
  
        return { error: false, msg: "Success", obj: "Success" };
    } catch (error) {
        console.error('Error updating request:', error);
        return { error: true, msg: "Error updating request" };
    }
  }

export {
    createTeacher,
    getTeacherById,
    getTeachers,
    updateTeacher,
    deleteTeacher,
    loginTeacher
};
