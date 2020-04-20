import express from "express";
import { SERVER_PORT } from "../global/environment";
import socketIO from "socket.io";
import http from "http";
import * as socket from '../sockets/socket';
export default class Server {

  public app: express.Application;
  public port: number;
  public io: socketIO.Server;
  private httpServer: http.Server;
  private static _instance:Server;

  private constructor() {
    
    this.app = express();
    this.port = SERVER_PORT;
    this.httpServer = new http.Server(this.app);
    this.io = socketIO(this.httpServer);
    this.escucharSockets();
  }
  public static get instance(){
      //si ya existe una instancia regresa la instancia si no existe cre una instancia
        return this._instance || (this._instance=new this());
  }
  private escucharSockets() {

    //Aqui escucho lo que el cliente emite
    console.log("Escuchando conexiones - sockets");


    //on es para escuchar
    this.io.on("connection", (cliente) => {
      console.log("Cliente conectado");
        //Mensajes
        socket.mensaje(cliente,this.io);
        //Desconectar
        socket.desconectar(cliente);
      
    });
  }
  start(callback: () => any) {
    this.httpServer.listen(this.port, callback);
  }
}
