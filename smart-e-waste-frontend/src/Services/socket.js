import SockJS from "sockjs-client/dist/sockjs";
import { Stomp } from "stompjs";

let stompClient = null;

export const connectSocket = (callback) => {

    const socket = new SockJS("http://localhost:8080/ws");

    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {

        stompClient.subscribe("/topic/ewaste", message => {

            callback(JSON.parse(message.body));

        });

    });

};

export const disconnectSocket = () => {

    if (stompClient) stompClient.disconnect();

}