const URL ='http://localhost:2000';


export async function getUsuarios(){
    const Options={
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const respuesta = await fetch(`${URL}/usuarios`, Options)
    const data= await respuesta.json()
    return data
}

export async function getUsuariosNombres(nombre){

    const Options={
        method:'GET',
        headers: {
            'Content-Type': 'application/json',

        }
    }
    const respuesta = await fetch(`${URL}/usuarios/nombre/${nombre}`, Options)
    const data= await respuesta.json()
     return data[0];
}