let socket;

export const initWebSocket = (dispatch) => {
  // Проверка на существующее подключение
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("WebSocket уже подключен");
    return;
  }

  // Создаем подключение
  socket = new WebSocket("ws://localhost:8080");

  socket.onopen = () => {
    console.log("WebSocket соединение установлено");
  };

  socket.onmessage = (event) => {
    try {
      const { type, data } = JSON.parse(event.data);
      if (type === "newTour") {
        dispatch({ type: "ADD_TOUR", payload: data }); // Диспатчим в Redux
      }
    } catch (error) {
      console.error("Ошибка при обработке сообщения WebSocket", error);
    }
  };

  socket.onerror = (error) => {
    console.error("Ошибка WebSocket", error);
  };

  socket.onclose = () => {
    console.log("WebSocket соединение закрыто");
  };
};

export const closeWebSocket = () => {
  if (socket) {
    socket.close();
    console.log("WebSocket закрыт");
  }
};
