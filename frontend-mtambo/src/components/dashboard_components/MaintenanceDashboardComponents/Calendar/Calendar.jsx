import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import CalendarOffcanvas from "./CalendarOffCanvasAddEvent";
import CalendarEventModal from "./CalendarEventModal";

const Calendar = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [showLeftSide, setShowLeftSide] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [modalEventData, setModalEventData] = useState({});
    const [events, setEvents] = useState([
        {
            id: "1",
            title: "Scheduled Task 1",
            start: "2025-01-20",  // Only the date, no time
            end: "2025-01-20",    // End date the same as start date
            description: "This task is scheduled to inspect HVAC units at the office.",
            status: "scheduled",
            backgroundColor: "rgb(250, 173, 20)",
            borderColor: "rgb(250, 173, 20)",
        },
        {
            id: "2",
            title: "Completed Task 1",
            start: "2025-01-19",
            end: "2025-01-19",
            description: "Repaired the elevator in building 3.",
            status: "completed",
            backgroundColor: "#068e44",
            borderColor: "#068e44",
        },
        {
            id: "3",
            title: "Overdue Task 1",
            start: "2025-01-18",
            end: "2025-01-18",
            description: "Overdue maintenance check on fire alarms in building 1.",
            status: "overdue",
            backgroundColor: "#f44336",
            borderColor: "#f44336",
        },
        {
            id: "4",
            title: "Scheduled Task 2",
            start: "2025-01-22",
            end: "2025-01-22",
            description: "Inspect air conditioning units in building 4.",
            status: "scheduled",
            backgroundColor: "rgb(250, 173, 20)",
            borderColor: "rgb(250, 173, 20)",
        },
        {
            id: "5",
            title: "Completed Task 2",
            start: "2025-01-17",
            end: "2025-01-17",
            description: "Completed plumbing repairs in building 2.",
            status: "completed",
            backgroundColor: "#068e44",
            borderColor: "#068e44",
        },
        {
            id: "6",
            title: "Overdue Task 2",
            start: "2025-01-18",
            end: "2025-01-18",
            description: "Overdue inspection of electrical wiring in building 5.",
            status: "overdue",
            backgroundColor: "#f44336",
            borderColor: "#f44336",
        },
        {
            id: "7",
            title: "Scheduled Task 3",
            start: "2025-01-24",
            end: "2025-01-24",
            description: "Schedule for replacing lighting fixtures in building 6.",
            status: "scheduled",
            backgroundColor: "rgb(250, 173, 20)",
            borderColor: "rgb(250, 173, 20)",
        },
        {
            id: "8",
            title: "Completed Task 3",
            start: "2025-01-16",
            end: "2025-01-16",
            description: "Completed HVAC system repair in building 7.",
            status: "completed",
            backgroundColor: "#068e44",
            borderColor: "#068e44",
        },
        {
            id: "9",
            title: "Overdue Task 3",
            start: "2025-01-15",
            end: "2025-01-15",
            description: "Overdue task to test emergency lighting system in building 3.",
            status: "overdue",
            backgroundColor: "#f44336",
            borderColor: "#f44336",
        },
        {
            id: "10",
            title: "Scheduled Task 4",
            start: "2025-01-28",
            end: "2025-01-28",
            description: "Scheduled to check fire extinguishers in building 9.",
            status: "scheduled",
            backgroundColor: "rgb(250, 173, 20)",
            borderColor: "rgb(250, 173, 20)",
        },
        {
            id: "11",
            title: "Completed Task 4",
            start: "2025-01-12",
            end: "2025-01-12",
            description: "Completed maintenance check on ventilation systems in building 8.",
            status: "completed",
            backgroundColor: "#068e44",
            borderColor: "#068e44",
        },
        {
            id: "12",
            title: "Overdue Task 4",
            start: "2025-01-10",
            end: "2025-01-10",
            description: "Overdue task for water leak inspection in building 10.",
            status: "overdue",
            backgroundColor: "#f44336",
            borderColor: "#f44336",
        },
        {
            id: "13",
            title: "Scheduled Task 5",
            start: "2025-01-30",
            end: "2025-01-30",
            description: "Scheduled to perform carpet cleaning in building 11.",
            status: "scheduled",
            backgroundColor: "rgb(250, 173, 20)",
            borderColor: "rgb(250, 173, 20)",
            color: "#000"
        },
        {
            id: "14",
            title: "Completed Task 5",
            start: "2025-01-25",
            end: "2025-01-25",
            description: "Completed general maintenance in building 12.",
            status: "completed",
            backgroundColor: "#068e44",
            borderColor: "#068e44",
        },
        {
            id: "15",
            title: "Overdue Task 5",
            start: "2025-01-05",
            end: "2025-01-05",
            description: "Overdue HVAC inspection in building 13.",
            status: "overdue",
            backgroundColor: "#f44336",
            borderColor: "#f44336",
        },
    ]);

    const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);
    const toggleLeftSide = () => setShowLeftSide(!showLeftSide);
    const [filters, setFilters] = useState({
        viewAll: true,
        personal: true,
        business: true,
        family: true,
        holiday: true,
        etc: true,
    });

    const handleEventClick = (info) => {
        // Extract the event data and show modal
        const eventData = {
            title: info.event.title,
            technician: "John Doe",
            venue: "Building 3",
            date: info.event.start.toLocaleDateString(),
            description: info.event.extendedProps.description || "No description available.",
        };
        setModalEventData(eventData);
        setShowEventModal(true);
    };
    const handleEventModalClose = () => {
        setShowEventModal(false);
    };

    const handleChange = (date) => setStartDate(date);

    const handleFilterChange = (event) => {
        const { name, checked } = event.target;
        setFilters((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const handleEventDrop = (info) => {
        // Update the event start and end when it's moved on the calendar
        const updatedEvents = events.map((event) =>
            event.id === info.event.id
                ? {
                    ...event,
                    start: info.event.startStr,
                    end: info.event.endStr,
                }
                : event
        );
        setEvents(updatedEvents);
    };

    const handleAddEvent = (eventData) => {
        const newEvent = {
            id: `${events.length + 1}`,
            ...eventData,
        };
        setEvents([...events, newEvent]);
    };

    // Event Content custom rendering (displaying badges with task name and status)
    const eventContent = (eventInfo) => {
        const { event } = eventInfo;
        const statusBadge = (
            <span
                className="badge"
                style={{
                    backgroundColor: event.extendedProps.backgroundColor,
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                }}
            >
                {event.extendedProps.title}
            </span>
        );

        return (
            <OverlayTrigger
                placement="top"
                overlay={
                    <Tooltip id={`tooltip-${event.id}`}>
                        <strong>{event.title}</strong>
                        <br />
                        {event.extendedProps.description}
                        <br />
                        <small>
                            {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
                        </small>
                    </Tooltip>
                }
            >
                <div>{statusBadge}</div>
            </OverlayTrigger>
        );
    };

    return (
        <div className="pc-container">
            <div className="pc-content">
                <div className="container-fluid date-section-container">
                    <div className="d-flex mtambo-calendar-container">
                        {/* Left Side Container */}
                        <div className={`calendar-left-side-container flex-shrink-0 flex-grow-0 w-auto ${showLeftSide ? "d-block mobile-calendar-leftside" : "d-none"} d-md-block`}>
                            <div
                                className={`${showLeftSide ? "calendar-overlay" : ""}`}
                                onClick={toggleLeftSide}
                            ></div>
                            <div className="calendar-left-side">
                                <div className="w-100 px-3 py-4">
                                    <button
                                        className="btn btn-primary btn-md w-100 d-flex justify-content-center align-items-center"
                                        type="button"
                                        onClick={toggleOffcanvas}
                                    >
                                        <i className="ri-add-line mr-2"></i> Add Event
                                    </button>
                                </div>
                                <hr className="calendar-section-hr" />
                                <div className="d-flex justify-content-center align-items-center w-100 custom-calendar">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleChange}
                                        inline
                                        className="custom-datepicker-input"
                                        dayClassName={(date) => {
                                            const day = date.getDate();
                                            return day % 2 === 0 ? "even-day" : "odd-day";
                                        }}
                                    />
                                </div>
                                <hr />
                                <div className="d-flex flex-column p-3 w-100">
                                    <h5 className="h5 mb-4">Event Filters</h5>
                                    <div className="form-check form-check-inline mb-2">
                                        <input
                                            className="form-check-input checkbox-viewAll-tasks"
                                            type="checkbox"
                                            id="viewAll"
                                            checked
                                            onChange={handleFilterChange}
                                            name="viewAll"
                                        />
                                        <label className="form-check-label" htmlFor="viewAll">
                                            View All
                                        </label>
                                    </div>
                                    {/* Filter Tasks */}
                                    {["scheduled", "completed", "overdue"].map((status) => (
                                        <div className="form-check form-check-inline mb-2" key={status}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`${status}-tasks`}
                                                name={status}
                                                checked={filters[status]}
                                                onChange={handleFilterChange}
                                            />
                                            <label className="form-check-label" htmlFor={`${status}-tasks`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)} tasks
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Right Side (Calendar View) */}
                        <div className="flex-grow-1 overflow-hidden">
                            <div className="px-3 py-4 fullcalendar-container">
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    initialView={"dayGridMonth"}
                                    headerToolbar={{
                                        start: "myCustomButton prev,next",
                                        center: "title",
                                        end: "dayGridMonth,timeGridWeek,timeGridDay",
                                    }}
                                    customButtons={{
                                        myCustomButton: {
                                            text: 'Menu',
                                            icon: 'hamburger',
                                            click: function () {
                                                toggleLeftSide();
                                            },
                                        },
                                    }}
                                    events={events.filter((event) =>
                                        filters.viewAll ||
                                        filters[event.status]
                                    )}
                                    eventClassNames={(info) => {
                                        // Based on event's status, apply different classes
                                        if (info.event.extendedProps.status === 'scheduled') {
                                            return ['scheduled-event'];
                                        } else if (info.event.extendedProps.status === 'completed') {
                                            return ['completed-event'];
                                        } else {
                                            return ['overdue-event'];
                                        }
                                    }}
                                    eventClick={handleEventClick}
                                    eventDrop={handleEventDrop}
                                    height="100vh"
                                />
                            </div>
                        </div>
                    </div>
                    <CalendarOffcanvas
                        showOffcanvas={showOffcanvas}
                        toggleOffcanvas={toggleOffcanvas}
                        handleAddEvent={handleAddEvent}
                    />
                    <CalendarEventModal
                        showEventModal={showEventModal}
                        eventData={modalEventData}
                        onClose={handleEventModalClose}
                    />
                </div>
            </div>
        </div>
    );
}

export default Calendar;