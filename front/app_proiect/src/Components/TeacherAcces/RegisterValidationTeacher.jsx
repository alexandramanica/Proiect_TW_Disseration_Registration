
function validation(values){
    let error={};
    
    if(values.email===""){
        error.email="Field should not be empty";
    }else{ 
        error.email="";
    }

    if(values.name===""){
        error.name="Field should not be empty";
    }else{ 
        error.name="";
    }

    if(values.password===""){
        error.password="Field should not be empty";
    }else{ 
        error.password="";
    }

    if (values.surname === "") {
        error.surname = "Field should not be empty";
    } else {
        error.surname = "";
    }

    return error;
}

export default validation;