let socket;

export const initWebSocket = (dispatch) => {
    socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
        console.log("WebSocket соединение установлено");
    };

    socket.onmessage = (event) => {
        const { type, data } = JSON.parse(event.data);
        if (type === "newTour") {
        dispatch({ type: "ADD_TOUR", payload: data }); // Диспатчим в Redux
        }
    };

    socket.onclose = () => {
        console.log("WebSocket соединение закрыто");
    };
};

export const closeWebSocket = () => {
    if (socket) socket.close();
};