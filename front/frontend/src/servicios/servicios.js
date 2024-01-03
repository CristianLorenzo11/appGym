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
export async function getPagos(){
    const Options={
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const respuesta = await fetch(`${URL}/pagos`, Options)
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
export async function getusuarioID(usuario_id) {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    try {
        const respuesta = await fetch(`${URL}/usuarios/${usuario_id}`, options);

        if (!respuesta.ok) {
            throw new Error(`Error al obtener el usuario con ID ${usuario_id}`);
        }

        const data = await respuesta.json();
        console.log('Datos del usuario recibidos:', data); // Agrega este log para depuración

        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
        throw error;
    }
}

export async function getCosto(id){
    const Options={
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const respuesta = await fetch(`${URL}/membresias/${id}`, Options);
    const data= await respuesta.json();
    return data.costo;
}


export async function AadPago(datos){
    const Options={
        method:'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json',

        }
    }
    const respuesta = await fetch(`${URL}/pagos`, Options)
    const data= await respuesta.json()
    return data
}