//validari formular login

function validation(values){
    let error={};
    
    if(values.email===""){
        error.email="Field should not be empty";
    }else{ 
        error.email="";
    }

    if(values.password===""){
        error.password="Field should not be empty";
    }else{ 
        error.password="";
    }

    return error;
}

export default validation;