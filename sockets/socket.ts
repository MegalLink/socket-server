import { Socket } from "socket.io";
import { UsuariosLista } from "../clases/usuarios-lista";
import { Usuario } from "../clases/usuario";
export const usuariosConectados=new UsuariosLista();

export const conectarCliente=(cliente:Socket,io:SocketIO.Server)=>{
    const ususario=new Usuario(cliente.id);
    usuariosConectados.agregarUsuario(ususario);
   
}

export const desconectar=(cliente:Socket,io:SocketIO.Server)=>{
    cliente.on('disconnect',()=>{
        const temp=usuariosConectados.borrarUsuario(cliente.id)
       console.log("USUARIO BORRADO:",temp);
       io.emit('usuarios-activos',usuariosConectados.getLista());

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
        io.emit('usuarios-activos',usuariosConectados.getLista());
        callback({
            ok:true,
            mensaje:`Usuario ${payload.nombre} configurado`
        })
    });
}
export const obtenerUsuarios=(cliente:Socket,io:SocketIO.Server)=>{
    cliente.on('obtener-usuarios',()=>{
        
        io.to(cliente.id).emit('usuarios-activos',usuariosConectados.getLista());
        
    });
}