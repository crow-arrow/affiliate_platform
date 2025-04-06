import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import { formatDate } from "@fullcalendar/core/index.js";

export const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);

  // Загружаем события из localStorage при монтировании
  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setCurrentEvents(savedEvents);
  }, []);

  // Функция добавления события
  const handleEventAdd = (event) => {
    setCurrentEvents((prev) => {
      const newEvents = [...prev, event.event.toPlainObject()];
      localStorage.setItem("events", JSON.stringify(newEvents));
      return newEvents;
    });
  };

  // Функция удаления события
  const handleEventRemove = (event) => {
    setCurrentEvents((prev) => {
      const newEvents = prev.filter((e) => e.id !== event.event.id);
      localStorage.setItem("events", JSON.stringify(newEvents));
      return newEvents;
    });
  };

  // Обработчик клика по дате
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: `${selected.dateStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };

      calendarApi.addEvent(newEvent);

      setCurrentEvents((prev) => {
        const updatedEvents = [...prev, newEvent];
        localStorage.setItem("events", JSON.stringify(updatedEvents));
        return updatedEvents;
      });
    }
  };

  return (
    <Box
      className="flex justify-between"
      sx={{
        "& .MuiDataGrid-cell": { margin: "auto", color: "white" },
        "& .fc-list-day-cushion": {
          backgroundColor: (theme) => `${theme.palette.secondary.main} !important`,
        },
        "& .fc-list-event:hover": { color: "black" },
        "& .fc-v-event, .fc-h-event": {
          backgroundColor: (theme) => `${theme.palette.secondary.main} !important`,
        },
        "& .fc-list-event-dot": {
          borderColor: (theme) => `${theme.palette.secondary.main} !important`,
        },
        "& .fc-popover-header": {
          background: "none !important",
        },
        "& .fc-popover-body": {
          background: "none !important",
        },
        "& .fc-popover": {
          borderRadius: "0.375rem",
          color: "black"
        },
      }}
    >
      {/* Боковая панель с событиями */}
      <Box className="flex-grow flex-shrink basis-[20%] p-4 overflow-y-auto rounded-2xl bg-secondary">
        <Typography className="text-center" variant="h4">Events</Typography>
        <List>
          {currentEvents.map((event) => (
            <ListItem key={event.id} className="bg-teal-900 my-2 rounded-xl">
              <ListItemText
                primary={event.title}
                secondary={
                  <Typography>
                    {formatDate(event.start, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Календарь */}
      <Box className="flex-grow flex-shrink basis-[80%] ml-4 p-4 rounded-2xl bg-secondary">
        <FullCalendar
          className="rounded-3xl"
          height="70vh"
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          scrollTime={0}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          select={handleDateClick}
          eventAdd={handleEventAdd}
          eventRemove={handleEventRemove}
          initialEvents={currentEvents}
        />
      </Box>
    </Box>
  );
};