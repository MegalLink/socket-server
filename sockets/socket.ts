import { Socket } from "socket.io";
import { UsuariosLista } from "../clases/usuarios-lista";
import { Usuario } from "../clases/usuario";
export const usuariosConectados=new UsuariosLista();

export const conectarCliente=(cliente:Socket)=>{
    const ususario=new Usuario(cliente.id);
    usuariosConectados.agregarUsuario(ususario);
}

export const desconectar=(cliente:Socket)=>{
    cliente.on('disconnect',()=>{
        const temp=usuariosConectados.borrarUsuario(cliente.id)
       console.log("USUARIO BORRADO:",temp)
    });
}
export const mensaje=(cliente:Socket,io:SocketIO.Server)=>{
    cliente.on('mensaje',(payload:{de: string, cuerpo:string})=>{
                console.log("Mensaje recibido", payload);
                    io.emit('mensaje-nuevo',payload);
    });
}
export const configurarUsuario=(cliente:Socket,io:SocketIO.Server)=>{
    cliente.on('configurar-usuario',(payload:{nombre:string},callback:Function)=>{
        usuariosConectados.actualizarNombre(cliente.id,payload.nombre);
        callback({
            ok:true,
            mensaje:`Usuario ${payload.nombre} configurado`
        })
    });
}